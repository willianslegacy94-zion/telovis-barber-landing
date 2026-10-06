# Deploy — Landing Telovis Barber

Site estático (HTML + CSS + JS vanilla, sem build). Fica publicado em
`https://kernellwc.online/vendas/`, servido direto pelo Nginx do host da VPS
`kernellwc.online` — **não roda em container, não tem processo pra reiniciar**.
Atualizar é só atualizar os arquivos em disco.

---

## Processo do dia a dia (depois do primeiro deploy)

Sempre que mexer em `index.html`, `style.css` ou `main.js`:

```bash
# 1) local — commitar e enviar pro GitHub
git add index.html style.css main.js
git commit -m "..."
git push origin main

# 2) na VPS — puxar o que mudou
ssh willians@2.24.117.12   # ou o alias configurado no seu SSH config
cd /var/www/telovis-barber-landing
git pull origin main
```

Não precisa de `nginx -t`, reload, build nem restart — o Nginx lê o arquivo do
disco a cada request (`alias`, sem cache de arquivo configurado). O `git pull`
já é o deploy inteiro.

Repo é **público**, então o `git pull` na VPS não pede autenticação.

---

## Primeiro deploy (ainda não feito)

Na VPS `kernellwc.online` (mesma VPS do Telovis Barber/Brainiac/Kalel, ver
`telovis-barber/deploy/RUNBOOK.md` no repo principal):

```bash
sudo mkdir -p /var/www/telovis-barber-landing
sudo chown $USER:$USER /var/www/telovis-barber-landing
git clone https://github.com/willianslegacy94-zion/telovis-barber-landing.git /var/www/telovis-barber-landing
```

Depois, aplicar a config do Nginx (já versionada em
`telovis-barber/deploy/nginx-kernellwc.conf`, bloco `location /vendas/`):

```bash
# copiar a versão atualizada do arquivo pra VPS (telovis-barber/deploy/nginx-kernellwc.conf)
# substitui o /etc/nginx/sites-available/kernellwc.online já existente
sudo nginx -t && sudo systemctl reload nginx
```

Certbot já cobre `kernellwc.online`/`www.kernellwc.online` (feito no deploy do
Telovis Barber) — `/vendas/` é um path do mesmo domínio, então o HTTPS já funciona sem
passo extra.

**Smoke test:**
```bash
curl -sI https://kernellwc.online/vendas/ | head -5
curl -s https://kernellwc.online/vendas/style.css -o /dev/null -w "%{http_code}\n"
```

---

## Se algo quebrar

```bash
cd /var/www/telovis-barber-landing
git log --oneline -5
git checkout <hash-anterior>
```

Reverter é instantâneo — não precisa rebuild nem restart, é só trocar o
conteúdo em disco.
