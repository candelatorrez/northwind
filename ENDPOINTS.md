# API Endpoints - Northwind Collections Manager

Documentación completa de todos los endpoints disponibles en la API.

**Base URL**: `http://localhost:8080`  
**Content-Type**: `application/json`

---

## 📋 Tabla de Contenidos

1. [Health Check](#health-check)
2. [Dashboard](#dashboard)
3. [Clients](#clients)
4. [Invoices](#invoices)
5. [Risk](#risk)
6. [Collection Actions](#collection-actions)
7. [Error Handling](#error-handling)
8. [Status Codes](#status-codes)

---

## Health Check

### GET /health

Verifica que el servidor y la base de datos estén disponibles.

**Request**:
```bash
curl http://localhost:8080/health
```

**Response** (200 OK):
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-06-15T10:30:45Z"
}
```

**Use Case**: Monitoreo, health checks, load balancers

---

## Dashboard

### GET /dashboard/metrics

Obtiene las métricas principales del dashboard.

**Request**:
```bash
curl http://localhost:8080/dashboard/metrics
```

**Response** (200 OK):
```json
{
  "totalClients": 420,
  "highRiskClients": 45,
  "overdueInvoices": 128,
  "outstandingAmount": 1250000.50
}
```

**Campos**:
- `totalClients` (int): Total de clientes en el sistema
- `highRiskClients` (int): Clientes con score ≥ 70
- `overdueInvoices` (int): Facturas vencidas
- `outstandingAmount` (float): Total pendiente de cobro

**Use Case**: Dashboard KPI cards

---

### GET /dashboard/clients

Obtiene lista de clientes con riesgo asociado. Ordenado por riesgo descendente.

**Request**:
```bash
curl http://localhost:8080/dashboard/clients
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Client 1",
    "email": "contact1@company.com",
    "segment": "enterprise",
    "status": "active",
    "monthlyBilling": 5234.50,
    "createdAt": "2024-06-01T10:00:00Z",
    "riskScore": 15,
    "riskLevel": "low",
    "lastActionAt": "2024-06-14T15:20:30Z"
  },
  {
    "id": 45,
    "name": "Client 45",
    "email": "contact45@company.com",
    "segment": "startup",
    "status": "at_risk",
    "monthlyBilling": 8500.00,
    "createdAt": "2024-05-15T08:30:00Z",
    "riskScore": 85,
    "riskLevel": "high",
    "lastActionAt": "2024-06-14T10:00:00Z"
  }
]
```

**Campos**:
- `id` (int): ID único del cliente
- `name` (string): Nombre del cliente
- `email` (string): Email de contacto
- `segment` (enum): "enterprise", "startup", "standard", "zombie"
- `status` (enum): "active", "at_risk", "delinquent", "suspended"
- `monthlyBilling` (float): Billing mensual en USD
- `createdAt` (datetime): Fecha de creación
- `riskScore` (int): 0-100 score de riesgo
- `riskLevel` (string): "low", "medium", "high"
- `lastActionAt` (datetime|null): Última acción registrada

**Use Case**: Dashboard clients table

---

## Clients

### GET /clients

Obtiene lista de todos los clientes (versión simple sin riesgo).

**Request**:
```bash
curl http://localhost:8080/clients
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Client 1",
    "email": "contact1@company.com",
    "segment": "enterprise",
    "status": "active",
    "monthlyBilling": 5234.50,
    "createdAt": "2024-06-01T10:00:00Z",
    "updatedAt": "2024-06-14T15:20:30Z"
  }
]
```

**Pagination**: No implementada (obtiene todos)

**Use Case**: Listados rápidos

---

### GET /clients/:id

Obtiene detalles de un cliente específico.

**Request**:
```bash
curl http://localhost:8080/clients/42
```

**Response** (200 OK):
```json
{
  "id": 42,
  "name": "Acme Corp",
  "email": "billing@acme.com",
  "segment": "enterprise",
  "status": "active",
  "monthlyBilling": 15000.00,
  "createdAt": "2024-01-15T09:30:00Z",
  "updatedAt": "2024-06-14T16:45:00Z"
}
```

**Error** (404 Not Found):
```json
{
  "error": "client not found"
}
```

**Parameters**:
- `id` (int, required): ID del cliente

**Use Case**: Obtener detalles de cliente para detail view

---

### PATCH /clients/:id/status

Actualiza el estado de un cliente.

**Request**:
```bash
curl -X PATCH http://localhost:8080/clients/42/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "at_risk"
  }'
```

**Response** (200 OK):
```json
{
  "id": 42,
  "name": "Acme Corp",
  "status": "at_risk",
  "updatedAt": "2024-06-15T10:30:45Z"
}
```

**Error** (400 Bad Request):
```json
{
  "error": "invalid status: must be one of [active, at_risk, delinquent, suspended]"
}
```

**Error** (404 Not Found):
```json
{
  "error": "client not found"
}
```

**Parameters**:
- `id` (int, required): ID del cliente

**Body**:
- `status` (string, required): Nuevo estado
  - Valid values: "active", "at_risk", "delinquent", "suspended"

**Validation**:
- ✅ Status debe ser uno de los valores permitidos
- ✅ Client debe existir

**Use Case**: Cambiar estado de cliente desde detail view

---

## Invoices

### GET /clients/:clientId/invoices

Obtiene todas las facturas de un cliente.

**Request**:
```bash
curl http://localhost:8080/clients/42/invoices
```

**Response** (200 OK):
```json
[
  {
    "id": 1001,
    "clientId": 42,
    "amount": 5000.00,
    "status": "pending",
    "dueDate": "2024-07-15T00:00:00Z",
    "createdAt": "2024-06-10T09:00:00Z",
    "paidAt": null
  },
  {
    "id": 1002,
    "clientId": 42,
    "amount": 3500.00,
    "status": "overdue",
    "dueDate": "2024-05-30T00:00:00Z",
    "createdAt": "2024-05-25T09:00:00Z",
    "paidAt": null
  }
]
```

**Campos**:
- `id` (int): ID de la factura
- `clientId` (int): ID del cliente
- `amount` (float): Monto en USD
- `status` (enum): "paid", "pending", "overdue"
- `dueDate` (datetime): Fecha de vencimiento
- `createdAt` (datetime): Fecha de creación
- `paidAt` (datetime|null): Fecha de pago (si aplica)

**Parameters**:
- `clientId` (int, required): ID del cliente

**Use Case**: Mostrar tabla de facturas en client detail

---

### POST /invoices/:invoiceId/pay

Marca una factura como pagada y recalcula el riesgo del cliente.

**Request**:
```bash
curl -X POST http://localhost:8080/invoices/1001/pay \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response** (200 OK):
```json
{
  "id": 1001,
  "clientId": 42,
  "amount": 5000.00,
  "status": "paid",
  "dueDate": "2024-07-15T00:00:00Z",
  "createdAt": "2024-06-10T09:00:00Z",
  "paidAt": "2024-06-15T10:30:45Z"
}
```

**Error** (404 Not Found):
```json
{
  "error": "invoice not found"
}
```

**Error** (400 Bad Request):
```json
{
  "error": "invoice already paid"
}
```

**Parameters**:
- `invoiceId` (int, required): ID de la factura

**Behavior**:
- ✅ Marca factura como pagada
- ✅ Sets `paidAt` a timestamp actual
- ✅ Automáticamente recalcula risk score del cliente
- ✅ Crea entry en audit trail (opcional para phase 2)

**Use Case**: Registrar pago de factura

---

## Risk

### GET /clients/:clientId/risk

Obtiene assessment de riesgo actual del cliente.

**Request**:
```bash
curl http://localhost:8080/clients/42/risk
```

**Response** (200 OK):
```json
{
  "id": 5001,
  "clientId": 42,
  "score": 42,
  "level": "medium",
  "reason": "One invoice overdue by 8 days",
  "createdAt": "2024-06-15T09:45:00Z"
}
```

**Campos**:
- `id` (int): ID del risk snapshot
- `clientId` (int): ID del cliente
- `score` (int): 0-100 score
- `level` (string): "low", "medium", "high"
- `reason` (string): Explicación del score
- `createdAt` (datetime): Cuándo se calculó

**Parameters**:
- `clientId` (int, required): ID del cliente

**Use Case**: Mostrar risk assessment en client detail

---

### POST /clients/:clientId/risk-snapshots

Crea un nuevo risk snapshot (Usado internamente después de pago).

**Request**:
```bash
curl -X POST http://localhost:8080/clients/42/risk-snapshots \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response** (201 Created):
```json
{
  "id": 5002,
  "clientId": 42,
  "score": 15,
  "level": "low",
  "reason": "All invoices paid - low risk",
  "createdAt": "2024-06-15T10:30:45Z"
}
```

**Error** (404 Not Found):
```json
{
  "error": "client not found"
}
```

**Parameters**:
- `clientId` (int, required): ID del cliente

**Behavior**:
- ✅ Calcula riesgo actual basado en invoices
- ✅ Usa algoritmo segment-aware
- ✅ Crea snapshot histórico
- ✅ Usa razón explicable

**Use Case**: Triggered automáticamente después de pago

---

## Collection Actions

### GET /clients/:clientId/actions

Obtiene historial de acciones de cobranza para un cliente.

**Request**:
```bash
curl http://localhost:8080/clients/42/actions
```

**Response** (200 OK):
```json
[
  {
    "id": 3001,
    "clientId": 42,
    "type": "call",
    "notes": "Client promised payment by EOW",
    "performedBy": "John Doe",
    "createdAt": "2024-06-14T15:30:00Z"
  },
  {
    "id": 3000,
    "clientId": 42,
    "type": "email",
    "notes": "Sent invoice reminder",
    "performedBy": "Jane Smith",
    "createdAt": "2024-06-13T09:00:00Z"
  }
]
```

**Campos**:
- `id` (int): ID de la acción
- `clientId` (int): ID del cliente
- `type` (enum): "call", "email", "note"
- `notes` (string): Detalles de la acción
- `performedBy` (string): Persona que realizó la acción
- `createdAt` (datetime): Cuándo se realizó

**Parameters**:
- `clientId` (int, required): ID del cliente

**Ordering**: Por `createdAt` descendente (más reciente primero)

**Use Case**: Mostrar historial en client detail

---

### POST /clients/:clientId/actions

Agrega una nueva acción de cobranza.

**Request**:
```bash
curl -X POST http://localhost:8080/clients/42/actions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "call",
    "notes": "Spoke to accounting manager, payment coming Monday",
    "performedBy": "John Doe"
  }'
```

**Response** (201 Created):
```json
{
  "id": 3002,
  "clientId": 42,
  "type": "call",
  "notes": "Spoke to accounting manager, payment coming Monday",
  "performedBy": "John Doe",
  "createdAt": "2024-06-15T10:30:45Z"
}
```

**Error** (400 Bad Request):
```json
{
  "error": "invalid request: type is required and must be one of [call, email, note]"
}
```

**Error** (400 Bad Request - Validation):
```json
{
  "error": "invalid request: notes is required and must be 1-500 characters"
}
```

**Error** (404 Not Found):
```json
{
  "error": "client not found"
}
```

**Parameters**:
- `clientId` (int, required): ID del cliente

**Body**:
- `type` (string, required): Tipo de acción
  - Valid values: "call", "email", "note"
- `notes` (string, required): Detalles/descripción
  - Length: 1-500 characters
- `performedBy` (string, required): Quién realizó la acción
  - Length: 1-100 characters

**Validation**:
- ✅ `type` debe ser uno de los valores permitidos
- ✅ `notes` debe ser string 1-500 chars
- ✅ `performedBy` debe ser string 1-100 chars
- ✅ Client debe existir

**Use Case**: Registrar acción de cobranza desde client detail

---

## Error Handling

### Error Response Format

Todos los errores siguen este formato:

```json
{
  "error": "descriptive error message",
  "timestamp": "2024-06-15T10:30:45Z"
}
```

### Validation Errors

Para requests inválidos (400):

```json
{
  "error": "invalid request: <field> <reason>",
  "timestamp": "2024-06-15T10:30:45Z"
}
```

Ejemplos:
```json
{
  "error": "invalid request: status must be one of [active, at_risk, delinquent, suspended]"
}
```

```json
{
  "error": "invalid request: type is required and must be one of [call, email, note]"
}
```

### Server Errors

Para errores de servidor (500):

```json
{
  "error": "internal server error",
  "timestamp": "2024-06-15T10:30:45Z"
}
```

