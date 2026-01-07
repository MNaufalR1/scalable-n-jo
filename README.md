# 🚀 Scalable Web Application with Docker

Aplikasi web scalable menggunakan Docker Compose dengan Nginx load balancer, Redis caching, dan PostgreSQL database. Dirancang untuk menangani traffic tinggi dengan horizontal scaling.

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## 📋 Daftar Isi

- [Arsitektur](#-arsitektur)
- [Fitur](#-fitur)
- [Prerequisites](#-prerequisites)
- [Instalasi](#-instalasi)
- [Penggunaan](#-penggunaan)
- [API Endpoints](#-api-endpoints)
- [Testing](#-testing)
- [Scaling](#-scaling)
- [Tech Stack](#-tech-stack)

## 🏗️ Arsitektur

\\\
┌─────────────┐
│   Internet  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  Nginx Load Balancer (Port 8080)│
└────────────┬────────────────────┘
             │
    ┌────────┼────────┐
    ▼        ▼        ▼
┌────────┐ ┌────────┐ ┌────────┐
│ App 1  │ │ App 2  │ │ App N  │
│ Node.js│ │ Node.js│ │ Node.js│
└───┬────┘ └───┬────┘ └───┬────┘
    │          │          │
    └──────────┼──────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
   ┌─────────┐  ┌──────────┐
   │  Redis  │  │PostgreSQL│
   │  Cache  │  │ Database │
   └─────────┘  └──────────┘
\\\

## ✨ Fitur

- ✅ **Load Balancing** - Nginx mendistribusikan traffic ke multiple app instances
- ✅ **Horizontal Scaling** - Scale up/down dengan mudah (1-10+ instances)
- ✅ **Redis Caching** - Performance boost hingga 10x lebih cepat
- ✅ **PostgreSQL Database** - Reliable data persistence
- ✅ **Health Checks** - Automatic monitoring untuk semua services
- ✅ **Auto Restart** - Container restart otomatis jika crash
- ✅ **Rate Limiting** - Proteksi dari abuse
- ✅ **Security Headers** - Built-in security best practices

## 📦 Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)

## 🚀 Instalasi

### 1. Clone Repository

\\\powershell
git clone https://github.com/MNaufalR1/scalable-web.git
cd scalable-web
\\\

### 2. Build & Start

\\\powershell
# Build images
docker-compose build

# Start dengan 5 replicas
docker-compose up -d --scale app=5
\\\

### 3. Akses Aplikasi

Buka browser: **http://localhost:8080**

## 💻 Penggunaan

### Start Application

\\\powershell
docker-compose up -d --scale app=5
\\\

### Stop Application

\\\powershell
docker-compose down
\\\

### Check Status

\\\powershell
docker-compose ps
\\\

## 📡 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| \GET\ | \/\ | Root endpoint |
| \GET\ | \/health\ | Health check |
| \GET\ | \/api/visits\ | Get visit count (cached) |
| \POST\ | \/api/visit\ | Add new visit |
| \GET\ | \/api/visits/all\ | Get all visits (paginated) |
| \GET\ | \/api/heavy\ | Heavy computation test |

## 🧪 Testing

### Test Load Balancing

\\\powershell
1..10 | ForEach-Object {
    \ = Invoke-RestMethod "http://localhost:8080/"
    Write-Host "Request \ : Container \"
}
\\\

### Test Cache Performance

\\\powershell
# First request (from database)
Measure-Command { Invoke-RestMethod "http://localhost:8080/api/visits" }

# Second request (from cache - faster!)
Measure-Command { Invoke-RestMethod "http://localhost:8080/api/visits" }
\\\

## 📈 Scaling

\\\powershell
# Scale up to 10 instances
docker-compose up -d --scale app=10

# Scale down to 2 instances
docker-compose up -d --scale app=2
\\\

## 🛠️ Tech Stack

- **Backend**: Node.js 18 + Express
- **Load Balancer**: Nginx Alpine
- **Cache**: Redis 7 Alpine
- **Database**: PostgreSQL 15 Alpine
- **Container**: Docker & Docker Compose

## 📁 Struktur Project

\\\
scalable-web/
├── app/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── healthcheck.js
├── nginx/
│   └── nginx.conf
├── db/
│   └── init.sql
├── docker-compose.yml
├── .gitignore
└── README.md
\\\

## 📊 Performance

- **Throughput**: 500-1000 requests/second
- **Cache**: 10x faster than database
- **Latency**: 10-100ms average

## 🐛 Troubleshooting

### Port Already in Use

\\\powershell
# Change port in docker-compose.yml
ports:
  - "3001:80"
\\\

### Container Not Starting

\\\powershell
# Check logs
docker-compose logs app

# Rebuild
docker-compose build --no-cache
docker-compose up -d
\\\

## 📝 License

MIT License

## 👨‍💻 Author

**M. Naufal R**

- GitHub: [@MNaufalR1](https://github.com/MNaufalR1)
- Email: m.naufal.r332@gmail.com

---

⭐ Star this repo if you find it useful!
