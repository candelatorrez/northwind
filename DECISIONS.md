# Decisiones Arquitectónicas - Northwind Collections Manager

## Introducción

Este documento registra las decisiones arquitectónicas más relevantes que guiaron el diseño del sistema. Cada decisión incluye el contexto, alternativas consideradas, y el razonamiento detrás de la elección.

---

## 1. Clean Architecture para Backend

### Decisión

Implementar el backend en Go siguiendo el patrón de **Clean Architecture** con 4 capas:
1. API (HTTP handlers)
2. Service (lógica de negocio)
3. Repository (acceso a datos)
4. Domain (modelos puros)

### Contexto

- Necesidad de mantener código escalable y testeable
- Equipo pequeño (2 personas) requiere claridad
- Posible crecimiento hacia microservicios futuro

### Por qué?

**Clean Architecture** porque:
- ✅ Clear separation of concerns
- ✅ Fácil de testear cada capa
- ✅ Escalable sin refactoring mayor
- ✅ Soporta crecimiento a DDD o microservicios
- ✅ Patrón bien establecido

---

## 2. Riesgo Segment-Aware en Lugar de One-Size-Fits-All


### Decisión

Implementar scoring de riesgo **adaptado por segmento** en lugar de una fórmula única para todos los clientes.

### Contexto

- Enterprise espera pagar en 75 días (política estándar)
- Startup tiene restricciones de cash flow (45 días es atraso)
- Zombie es siempre riesgo (no pagan de forma crónica)
- Same score es injusto: 45 días para Enterprise ≠ 45 días para Startup

### Alternativas Consideradas

| Enfoque | Características | Problema |
|---------|-----------------|----------|
| One-size-fits-all | Mismo score para todos | Ignora realidades de negocio |
| Segment-aware | Score ajustado por segmento | ✅ Elegido |
| ML Predictive | Predicción automática | No hay datos históricos |

### Algoritmo Implementado

```go
func (s *InvoiceService) calculateRiskScore(invoices []domain.Invoice, segment string) (int, string, string) {
    switch segment {
    case "enterprise":
        // 75 días = policy -> OK
        // 75+ días = atraso
        if daysOverdue > 75 {
            score = high
        }
    case "startup":
        // 45 días = límite -> OK
        // 45+ días = atraso (cash flow)
        if daysOverdue > 45 {
            score = high
        }
    case "standard":
        // 30 días = estándar
        if daysOverdue > 30 {
            score = high
        }
    case "zombie":
        // Cualquier atraso = siempre riesgo
        score = always_high
    }
}
```

### Por qué?

**Segment-aware** porque:
- ✅ Refleja realidades de negocio
- ✅ Identificación más precisa de riesgo
- ✅ Políticas diferenciadas de crédito
- ✅ Permite tolerar Enterprise delays sin alarmar

### Implicaciones

- **Positivas**: Scoring justo y contextual
- **Negativas**: Más complejidad que fórmula simple
- **Futuro**: Calibrable por análisis histórico

---

## 3. Sin Autenticación Inicial (Equipo Pequeño)

### Decisión

**No implementar autenticación en MVP** porque:
- Equipo pequeño (no multi-user necesario)
- Enfoque en lógica de negocio
- Auth es feature que puede agregarse luego

### Contexto

- Northwind es un equipo pequeño/interno
- Prototipo rápido necesario
- Security puede ser refactorizado después


### Por qué

**No implementar inicialmente** porque:
- ✅ Acelera MVP
- ✅ Auth es orthogonal a lógica de negocio
- ✅ Fácil de agregar sin refactor mayor
- ✅ Prioridad: validar modelo de negocio

---

## 4. React + TypeScript en Lugar de Framework Pesado

### Decisiones Relacionadas

#### Custom CSS en Lugar de Tailwind

**Por qué**:
- ✅ Tailwind agrega 50KB más
- ✅ Custom utilities son simples (500 líneas)
- ✅ Control total de estilos
- ❌ Menos ecosistema que Tailwind

#### Hooks Personalizados en Lugar de Redux/Zustand

**Por qué**:
- ✅ Solo 3-4 fuentes de datos globales
- ✅ Hooks reducen boilerplate
- ✅ Fácil de entender
- ❌ No soporta muy bien estado compartido complejo

### Decisión Final

**React + TypeScript + Custom Utilities** porque:
- ✅ Balance perfecto de simplicidad/power
- ✅ Bundle size optimizado (~150KB total)
- ✅ TypeScript evita errores
- ✅ Hooks pattern es moderno
- ✅ Escalable para phase 2

---

## 4. Auto-Recalculation de Riesgo Después de Pagos

### Decisión

Cuando un cliente paga una factura → **Automáticamente recalcular su risk score**.

### Contexto

- Sistema debe reflejar realidad de riesgo rápidamente
- Cobranzas necesita scores actualizados
- Payment es el evento más importante para recalcular

### Implementación

```go
func (s *InvoiceService) MarkAsPaid(invoiceID uint) error {
    // 1. Marcar factura como pagada
    if err := s.invoiceRepository.MarkAsPaid(invoiceID); err != nil {
        return err
    }
    
    // 2. Obtener ID de cliente
    invoice, _ := s.invoiceRepository.FindByID(invoiceID)
    
    // 3. ✅ Automáticamente recalcular riesgo
    _ = s.CalculateRisk(invoice.ClientID)
    
    return nil
}
```

### Por qué

**Recalculation Inmediata** porque:
- ✅ Mantiene datos consistentes
- ✅ Cobranzas ve cambios inmediato
- ✅ No overhead significativo
- ✅ Mejora UX (risk score actualizado)

---

## 5. Seed Data Realista en Lugar de Mínima

### Decisión

Generar **420 clientes + 2,000+ facturas** con distribución realista en lugar de pocos registros de prueba.

### Contexto

- Necesidad de testing realista
- Dashboard debe verse con datos
- Demostración a stakeholders
- Performance testing en escala cercana a producción

### Distribución Implementada

```
Clientes:
- Enterprise: 50% (210) - bajo riesgo
- Startup: 30% (126) - riesgo medio
- Standard: 15% (63) - variable
- Zombie: 5% (21) - alto riesgo

Facturas por cliente: 1-5
- Paid: 60%
- Pending: 25%
- Overdue: 15%
```

### Por qué

**420 Clientes Realistas** porque:
- ✅ Dashboard se ve lleno y útil
- ✅ Testing en escala cercana a producción
- ✅ Demostración impacta
- ✅ Performance baseline realista

---

## Decisiones Rechazadas

### ❌ GraphQL API

**Por qué no**: 
- Complejidad inicial para casos de uso simple
- REST es suficiente para dashboard
- 5 endpoints simples no justifican GraphQL


### ❌ Microservicios

**Por qué no**:
- Team size 
- Overhead de orchestración > beneficio
- SLA simple suficiente


