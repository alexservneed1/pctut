# Развёртывание «ПК ТУТ» на VDS (Ubuntu 22.04 / 24.04)

Пошаговая инструкция для новичка. Требования к VDS: **2 vCPU, 2 ГБ RAM, 20 ГБ диска, Ubuntu 22.04/24.04, root или sudo-доступ**.

Все команды выполняются в терминале VDS через `ssh`.

---

## 1. Подключение к VDS

С вашего компьютера:

```bash
ssh root@IP_ВАШЕГО_СЕРВЕРА
```

Первый раз спросит подтверждение отпечатка — введите `yes`. Затем пароль (его прислал хостер).

**Рекомендуется** сразу создать не-root пользователя:

```bash
adduser deploy
usermod -aG sudo deploy
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/ 2>/dev/null || true
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh && chmod 600 /home/deploy/.ssh/authorized_keys 2>/dev/null || true
```

Дальше можно продолжать под `root` или зайти под `deploy` и добавлять `sudo` перед командами.

---

## 2. Обновление системы и базовые пакеты

```bash
apt update && apt upgrade -y
apt install -y curl git ufw ca-certificates
```

Настроим фаервол (открываем только SSH и HTTP/HTTPS):

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

---

## 3. Установка Docker и Docker Compose plugin

Официальный способ:

```bash
# Ключ и репозиторий Docker
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Проверка
docker --version
docker compose version
```

Если работаете под не-root пользователем — добавьте его в группу `docker` и перезайдите:

```bash
usermod -aG docker deploy
# затем выйти из ssh и зайти заново
```

---

## 4. Загрузка проекта на сервер

Есть два способа — выбирайте удобный.

### Способ A. Git clone (если есть репозиторий)

```bash
cd /opt
git clone <ССЫЛКА_НА_РЕПОЗИТОРИЙ> pktut
cd pktut
```

### Способ B. Загрузить архивом с вашего компьютера

С локальной машины:

```bash
# упаковать (без node_modules и .git — они не нужны)
tar --exclude='node_modules' --exclude='.git' --exclude='build' \
    -czf pktut.tar.gz -C /path/to/project .

# отправить на сервер
scp pktut.tar.gz root@IP_СЕРВЕРА:/opt/
```

На сервере:

```bash
cd /opt
mkdir pktut && tar -xzf pktut.tar.gz -C pktut
cd pktut
```

---

## 5. Заполнение `.env`

```bash
cp deploy/.env.example deploy/.env
nano deploy/.env
```

Обязательно заполнить:

- `ADMIN_TOKEN` — сгенерируйте длинную случайную строку:
  ```bash
  openssl rand -hex 24
  ```
  и вставьте результат (например, `ADMIN_TOKEN=a3f2e...c9`).
- `CORS_ORIGINS` — список ваших доменов через запятую, например:
  `CORS_ORIGINS=https://pctut.ru,https://www.pctut.ru`.

Опционально:

- `VK_TOKEN`, `VK_PEER_ID` — оставьте пустыми, включим позже (см. раздел «Включение VK-уведомлений» ниже).

Сохранить: `Ctrl+O`, `Enter`, выйти `Ctrl+X`.

---

## 6. Первый запуск

```bash
cd /opt/pktut/deploy
docker compose up -d --build
```

Первая сборка занимает 3–8 минут (собирается фронт React + backend Python).

Проверка, что всё запущено:

```bash
docker compose ps
```

Все три контейнера должны быть в статусе `Up` (или `healthy`):

- `pktut_mongo`
- `pktut_backend`
- `pktut_frontend`

Быстрая проверка API:

```bash
curl -s http://127.0.0.1/api/health
# Ожидаем: {"status":"healthy"}
```

Открыть в браузере: `http://IP_СЕРВЕРА` — должен показаться сайт.

---

## 7. Привязка домена

1. В панели вашего регистратора домена создайте DNS-запись:

   | Тип | Имя | Значение |
   |---|---|---|
   | A   | `@`   | IP_ВАШЕГО_СЕРВЕРА |
   | A   | `www` | IP_ВАШЕГО_СЕРВЕРА |

2. Подождите распространения DNS (обычно 5–30 минут). Проверить:

   ```bash
   dig +short ваш-домен.ru
   ```
   Должен вернуть IP сервера.

3. Пропишите домен в `deploy/.env` → `CORS_ORIGINS` и перезапустите backend:

   ```bash
   cd /opt/pktut/deploy
   docker compose up -d --force-recreate backend
   ```

---

## 8. SSL-сертификат (HTTPS)

Самый простой способ — использовать **Caddy** как reverse-proxy на хосте. Caddy автоматически получает и обновляет Let's Encrypt сертификаты. Это удобнее, чем ставить certbot и править nginx.

### 8.1. Установка Caddy на хосте

```bash
apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
  | tee /etc/apt/sources.list.d/caddy-stable.list
apt update
apt install -y caddy
```

### 8.2. Изменить публикацию портов у docker-compose

Чтобы Caddy на хосте мог занять порты 80/443, а фронт-контейнер должен слушать
только внутренний порт. Отредактируйте `/opt/pktut/deploy/docker-compose.yml`:

```yaml
  frontend:
    ...
    ports:
      - "127.0.0.1:8080:80"   # вместо "80:80"
```

Перезапустите:

```bash
cd /opt/pktut/deploy && docker compose up -d --force-recreate frontend
```

### 8.3. Настроить Caddyfile

```bash
nano /etc/caddy/Caddyfile
```

Вставьте (замените домен):

```caddy
ваш-домен.ru, www.ваш-домен.ru {
    encode zstd gzip
    reverse_proxy 127.0.0.1:8080
}
```

Перезапустите Caddy:

```bash
systemctl reload caddy
```

Caddy сам получит и продлит SSL. Проверьте: `https://ваш-домен.ru` — должен открыться сайт с зелёным замком.

> **Альтернатива**: если хотите остаться на nginx + certbot — вариант описан в комментарии в конце документа.

### 8.4. (Опция) Редирект `www` → корневой домен

В `Caddyfile`:

```caddy
www.ваш-домен.ru {
    redir https://ваш-домен.ru{uri} permanent
}

ваш-домен.ru {
    encode zstd gzip
    reverse_proxy 127.0.0.1:8080
}
```

---

## 9. Полезные команды

### Логи

```bash
cd /opt/pktut/deploy

docker compose logs -f backend       # логи API в реальном времени
docker compose logs -f frontend      # логи nginx
docker compose logs --tail=200       # последние 200 строк со всех сервисов
```

### Рестарт / статус

```bash
docker compose restart backend       # перезапустить только backend
docker compose restart               # все три сервиса
docker compose ps                    # статус контейнеров
docker stats                         # CPU/RAM в реальном времени
```

### Обновление кода

После изменений в исходниках:

```bash
cd /opt/pktut
git pull                             # или заново залить архив

cd deploy
docker compose up -d --build
```

`--build` пересоберёт образы; volume `mongo_data` не трогается — заявки сохраняются.

### Бэкап MongoDB

```bash
cd /opt/pktut/deploy
docker compose exec -T mongo mongodump --archive --db pktut \
  | gzip > ~/pktut-backup-$(date +%F).gz
```

Восстановление:

```bash
gunzip -c ~/pktut-backup-YYYY-MM-DD.gz \
  | docker compose exec -T mongo mongorestore --archive --drop
```

---

## 10. Включение VK-уведомлений

Уведомления о новых заявках приходят в VK-беседу или в личку — на ваш выбор.

1. **Классическая беседа (рекомендуется):**
   - В личном VK одного из админов создайте групповой чат «ПК ТУТ — Заявки».
   - В настройках чата добавьте ваше сообщество как участника (нужно чтобы у сообщества были включены «Возможности бота»).
   - В URL беседы найдите `sel=cXXX` — `XXX` это `chat_id`.
   - `VK_PEER_ID = 2000000000 + chat_id`.

2. **Токен сообщества:**
   - В настройках сообщества → «Работа с API» → «Долгосрочный ключ доступа» → создайте с правами `Сообщения` и `Управление`.
   - Скопируйте токен.

3. **Пропишите в `deploy/.env`:**

   ```
   VK_TOKEN=vk1.a.xxxxxxxxxxxxxxxxxxxxxxx
   VK_PEER_ID=2000000001
   ```

4. **Перезапустите backend:**

   ```bash
   cd /opt/pktut/deploy
   docker compose up -d --force-recreate backend
   ```

5. **Проверка:** отправьте тестовую заявку через сайт. В беседу должно прийти сообщение вида:

   ```
   Новая заявка ПК ТУТ
   Имя: ...
   Телефон: ...
   Услуга: ...
   Комментарий: ...
   ```

   Если сообщение не пришло — посмотрите `docker compose logs backend | grep VK`.
   Ошибки VK не роняют приём заявок — они всегда сохраняются в БД.

---

## 11. Возможные проблемы

| Симптом | Причина / решение |
|---|---|
| `Bind for 0.0.0.0:80 failed: port is already allocated` | На хосте уже что-то слушает порт 80 (nginx, apache). `systemctl stop nginx && systemctl disable nginx`. |
| Форма отправляется, но заявки не появляются в /admin | Проверить `ADMIN_TOKEN` в `.env` совпадает с тем, что вы вводите на `/admin`. Логи: `docker compose logs backend`. |
| «Заявки не отправляются» в браузере | Открыть DevTools → Network → посмотреть ответ на POST /api/leads. Скорее всего CORS: добавьте домен в `CORS_ORIGINS`. |
| Не собирается frontend, «out of memory» | На VDS 2 ГБ RAM — включите swap: `fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile`. |
| Yandex-карта не грузится | Проверить, что нет блокировки внешних доменов на уровне сети/фаервола. |

---

## 12. Альтернатива Caddy — nginx на хосте + certbot

Если по каким-то причинам Caddy не подходит:

```bash
apt install -y nginx certbot python3-certbot-nginx
```

Отредактируйте `docker-compose.yml`: `ports: - "127.0.0.1:8080:80"`.

Создайте `/etc/nginx/sites-available/pktut`:

```nginx
server {
    listen 80;
    server_name ваш-домен.ru www.ваш-домен.ru;
    location / { proxy_pass http://127.0.0.1:8080; proxy_set_header Host $host; }
}
```

Активируйте и получите сертификат:

```bash
ln -s /etc/nginx/sites-available/pktut /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru
```

Certbot сам добавит блок с 443 и настроит редирект.

---

Готово. При возникновении вопросов — соберите `docker compose logs --tail=200 > logs.txt` и пришлите файл.
