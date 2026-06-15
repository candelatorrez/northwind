# Northwind Manager 

Un sistema B2B SaaS moderno para gestionar cobranzas y evaluar el riesgo de delinquencia en clientes.

##  Descripción Breve

**Northwind** es una plataforma integral diseñada para que equipos de finanzas gestionen eficientemente el riesgo de insolvencia en su cartera de clientes. Con análisis inteligente de riesgo basado en segmentos de clientes, la plataforma ayuda a:

-  Visualizar métricas de cartera en tiempo real
-  Identificar clientes de alto riesgo automáticamente
-  Registrar acciones de cobranza
-  Recalcular riesgo automáticamente tras pagos

---

##  Stack Tecnológico

### Backend
- **Lenguaje**: Go 1.26+
- **Framework**: Gin Web Framework
- **ORM**: GORM
- **Base de Datos**: PostgreSQL 17
- **Arquitectura**: Clean Architecture

### Frontend
- **Framework**: React 19+
- **Lenguaje**: TypeScript 6.0+
- **Build**: Vite
- **HTTP**: Axios
- **Estilos**: CSS Utilities personalizado

### DevOps
- **Contenedorización**: Docker & Docker Compose
- **Base de Datos**: PostgreSQL en container

---

##  Requisitos

### Obligatorios
- Docker & Docker Compose
- Git

### Opcionales (Desarrollo Local)
- Go 1.26+ (para backend sin Docker)
- Node.js 18+ (para frontend sin Docker)

---

##  Cómo Levantar el Proyecto


#### 1. Iniciar Base de Datos
```bash
docker-compose up -d
# Espera 3-5 segundos para que PostgreSQL inicie
```

#### 2. Iniciar Backend
```bash
cd backend
go run cmd/server/main.go
```

Expected output:
```
database connected
database migrated
seed completed
server running on :8080
```

#### 3. Iniciar Frontend
En otra terminal:
```bash
cd frontend
npm install  
npm run dev
```

Expected output:
```
VITE v8.0.12 ready in 245 ms
➜ Local: http://localhost:5173/
```

#### 4. Acceder a la Aplicación
Abre el navegador en: **http://localhost:5173**

---

##  Cómo Probar el Flujo Principal

### Flujo Completo (5 minutos)

#### 1. Ver Dashboard
```
1. Ve a http://localhost:5173
2. Verás:
   - 4 KPI cards (Cartera, Mora, High Risk, Overdue)
   - Tabla con 420 clientes
   - Filtros de búsqueda
```

#### 2. Filtrar Clientes
```
1. En Filter Bar, selecciona:
   - Segment: "Enterprise" 
   - Status: "Active"
2. Verás solo clientes Enterprise activos
```

#### 3. Ver Detalles del Cliente
```
1. Haz clic en cualquier cliente de la tabla
2. Verás:
   - Información del cliente
   - Score de riesgo con explicación
   - Tabla de facturas
   - Historial de acciones de cobranza
```

#### 4. Marcar Factura como Pagada
```
1. En la tabla de invoices, busca una con status "Pending" o "Overdue"
2. Haz clic en "Mark Paid"
3. El riesgo del cliente se recalcula automáticamente
4. Recarga la página para ver cambios
```

#### 5. Agregar Acción de Cobranza
```
1. Desplázate a "Collection Actions"
2. Completa el formulario:
   - Type: "Call" / "Email" / "Note"
   - Notes: Tu comentario
   - Performed By: Tu nombre
3. Haz clic en "Add Action"
4. Verás la acción en el historial
```

### Flujo de API (Mediante curl)

#### Endpoints Principales
```bash
# 1. Health Check
curl http://localhost:8080/health

# 2. Ver todas las métricas
curl http://localhost:8080/dashboard/metrics | jq

# 3. Ver clientes con riesgo
curl http://localhost:8080/dashboard/clients | jq '.[0]'

# 4. Ver detalles del cliente 1
curl http://localhost:8080/clients/1 | jq

# 5. Ver facturas del cliente 1
curl http://localhost:8080/clients/1/invoices | jq

# 6. Ver riesgo del cliente 1
curl http://localhost:8080/clients/1/risk | jq

# 7. Ver acciones de cobranza del cliente 1
curl http://localhost:8080/clients/1/actions | jq

# 8. Cambiar estado del cliente a "at_risk"
curl -X PATCH http://localhost:8080/clients/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "at_risk"}'

# 9. Marcar factura como pagada
curl -X POST http://localhost:8080/invoices/1/pay \
  -H "Content-Type: application/json" \
  -d '{}'

# 10. Agregar acción de cobranza
curl -X POST http://localhost:8080/clients/1/actions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "call",
    "notes": "Client promises to pay by EOW",
    "performedBy": "John Doe"
  }'
```

---


##  Segmentación de Clientes

El sistema ajusta automáticamente el riesgo según el segmento:

| Segmento | % Cartera | Política de Pago | Umbral Alto Riesgo |
|----------|-----------|------------------|-------------------|
| Enterprise | 50% | 75 días | >75 días overdue |
| Startup | 30% | 45 días | >45 días overdue |
| Standard | 15% | 30 días | >30 días overdue |
| Zombie | 5% | Inmediato | Cualquier atraso |

---

## Métricas Principales

### Dashboard KPIs
- **Total Cartera**: Suma de facturas pendientes y vencidas
- **Mora %**: (Facturas vencidas / Total facturas) × 100
- **High Risk Clients**: Clientes con score ≥ 70
- **Overdue Invoices**: Facturas con due date < hoy

### Risk Score
- **Rango**: 0-100
- **Bajo**: < 40 (pagos al día)
- **Medio**: 40-69 (algunos atrasos)
- **Alto**: ≥ 70 (múltiples atrasos)

---

##  Datos de Prueba

### Seed Data
- **420 clientes** pre-configurados
- **2,000+ facturas** con estados realistas
- **Colección de acciones** de ejemplo
- **Risk snapshots** pre-calculados

---



##  Casos de Uso Principales

### 1. Analista de Riesgos
```
1. Ve Dashboard → Identifica high-risk clients
2. Filtra por segment y risk level
3. Revisa riesgo específico del cliente
4. Planifica acciones de cobranza
```

### 2. Cobranzas
```
1. Ve clientes a cobrar (status = "at_risk" o "delinquent")
2. Hace clic en cliente → ve facturas vencidas
3. Registra llamada/email como acción
4. Espera pago
5. Marca factura como pagada → Riesgo se recalcula
```

### 3. Ejecutivo Financiero
```
1. Ve Dashboard KPIs
2. Monitorea Mora % y High Risk Clients
3. Revisa trends a lo largo del tiempo
4. Toma decisiones sobre políticas de crédito
```

---

