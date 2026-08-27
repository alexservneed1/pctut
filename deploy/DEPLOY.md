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
cp deploy/env.example deploy/.env
nano deploy/.env
```

> Файл-шаблон называется `env.example` (без точки в начале) — так как Emergent
> push-агент фильтрует имя `.env.example` при синхронизации с GitHub.
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

Все контейнеры должны быть в статусе `Up` (или `healthy`):

- `pktut_mongo`
- `pktut_backend`
- `pktut_frontend`
- `pktut_caddy`

Быстрая проверка API (через caddy, порт 80 отдаёт редирект на HTTPS после
привязки домена — до этого можно проверять напрямую):

```bash
# До DNS/домена — проверяем внутренним curl'ом через frontend-контейнер:
docker compose exec frontend wget -qO- http://127.0.0.1/api/health
# Ожидаем: {"status":"healthy"}
```

Открыть в браузере (пока без домена): `http://IP_СЕРВЕРА` — Caddy отдаст сайт.
После привязки домена (шаг 7) сайт будет по `https://pctut.ru`.

---

## 7. Привязка домена pctut.ru

1. **DNS-записи** — в панели регистратора домена `pctut.ru` создайте:

   | Тип | Имя  | Значение          | TTL |
   |-----|------|-------------------|-----|
   | A   | `@`  | IP_ВАШЕГО_СЕРВЕРА | 300 |
   | A   | `www`| IP_ВАШЕГО_СЕРВЕРА | 300 |

2. **Проверка распространения DNS** (обычно 5–30 минут):

   ```bash
   dig +short pctut.ru
   dig +short www.pctut.ru
   # Оба должны вернуть IP вашего сервера
   ```

   Или онлайн: <https://dnschecker.org/#A/pctut.ru>

3. **CORS_ORIGINS** — обновите значение в `deploy/.env`, не трогая остальные строки:

   ```bash
   cd ~/pktut/deploy
   sed -i 's|^CORS_ORIGINS=.*|CORS_ORIGINS=https://pctut.ru,https://www.pctut.ru|' .env
   grep CORS_ORIGINS .env    # проверка
   ```

4. **Перезапустить backend** (чтобы подхватил новые CORS):

   ```bash
   docker compose up -d --force-recreate backend
   ```

---

## 8. SSL-сертификат (HTTPS через Caddy)

**Ничего дополнительно устанавливать не нужно** — сервис `caddy` уже описан
в `docker-compose.yml` и получает сертификаты автоматически.

### 8.1. Как это работает

- Caddy слушает `:80` и `:443` на хосте.
- Как только DNS `pctut.ru` → IP сервера начнёт резолвиться, Caddy сам
  получит сертификаты Let's Encrypt для `pctut.ru` и `www.pctut.ru`
  (обычно занимает 20–60 секунд после первого HTTPS-запроса).
- Сертификаты хранятся в docker-volume `caddy_data` — переживают
  `docker compose down/up` и рестарт сервера.
- Продление раз в 60 дней — тоже автоматически.

### 8.2. Проверка после DNS

```bash
# Проверить, что Caddy видит домен и получил сертификат:
docker compose logs caddy | grep -Ei "obtained|certificate"

# HTTPS-проверка:
curl -sI https://pctut.ru/ | head -5
# Ожидаем: HTTP/2 200 (или 301 на www→apex)
```

Открыть в браузере: `https://pctut.ru` — должен показаться сайт с зелёным замком.
`https://www.pctut.ru` — редирект на `https://pctut.ru`.

### 8.3. Если сертификат не выпустился

- Убедитесь, что порт 80 доступен снаружи (`ufw allow 80/tcp`, `443/tcp`).
- Проверьте DNS ещё раз (`dig +short pctut.ru`).
- Убедитесь, что на порту 80 хоста больше ничего не висит:
  `ss -ltnp | grep -E ':80|:443'` — должен быть только процесс docker-proxy для контейнера caddy.
- Логи Caddy: `docker compose logs -f caddy`.

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
