# AI Assistant Prompts 

Estos son los prompts de IA que utilicé para guiarme durante el challenge.

---

##  README Prompts

### Prompt 1: Mejorar Descripción General

Lo utilicé principalmente para tener un README completo y detallado para que cualquier miembro del equipo que ingrese pueda levantarlo correctamente sin complicaciones y pueda tener un context completo.

```
Analiza este README para el proyecto "Northwind Collections Manager" 
y mejora la sección de descripción breve. 

Requisitos:
- Debe explicar en 2-3 párrafos qué es la aplicación
- Incluye problema que resuelve

Contexto: Es un SaaS para gestionar cobranzas y evaluar riesgo de clientes.
Tiene 420 clientes, MRR $380K, y tasa de mora subió de 6% a 14%.



```

### Prompt 2: Challenge Strategy

Este es el prompt principal en el que base mi arquitectura de la aplicación:

```

Estoy trabajando en un challenge técnico y necesito ayuda para diseñar una arquitectura prolija, escalable y bien pensada.

El contexto es el siguiente:

Trabajo en una empresa SaaS B2B llamada Northwind que vende software de gestión a otras empresas. Tenemos aproximadamente 420 clientes activos y una facturación mensual de USD 380.000, con tickets que van desde USD 200 hasta USD 15.000.

El equipo de finanzas está compuesto por solo 2 personas y actualmente gestiona la cobranza de manera manual usando una planilla de Google Sheets que actualizan semanalmente. A partir de ahí deciden acciones como: a quién llamar, a quién enviar recordatorios y a quién no molestar.

Problemas actuales:
La tasa de mora subió del 6% al 14% en un año y no se entiende bien el motivo.
Los clientes son muy heterogéneos:
Empresas grandes que pagan a 75 días por procesos internos.
Startups que pueden quedarse sin caja de un día para otro.
Clientes “zombi” que siguen consumiendo el servicio sin pagar hace más de 90 días.
El sistema de recordatorios actual no es efectivo:
Clientes grandes ignoran los emails automáticos.
Clientes chicos se sienten presionados.
Clientes en crisis reciben el mismo tratamiento que el resto.
Lo que se necesita:

La CEO pidió lo siguiente (textual):

“Necesitamos una herramienta para gestionar la cobranza y anticiparnos a los problemas. Algo que nos ayude a saber dónde poner foco. Tienes 3 días.”

No hay PRD, no hay diseño previo, no hay product manager. Solo este problema.

Restricciones:
No hay acceso a datos reales (solo se pueden asumir datos sintéticos).
El equipo es pequeño (finanzas 2 personas).
Se puede proponer cualquier arquitectura, pero debe ser razonable para un SaaS B2B.
Se valora especialmente la capacidad de priorizar, segmentar clientes y automatizar decisiones.
Lo que necesito que me entregues:

Quiero que diseñes una arquitectura completa que incluya:

Arquitectura general del sistema (alto nivel)
Modelo de datos propuesto
Cómo se ingieren y procesan los datos
Cómo se segmentan los clientes (lógica o reglas)
Flujo de cobranza / dunning inteligente
Componentes backend y frontend sugeridos
Posible uso de eventos o colas
Cómo escalaría el sistema en el tiempo
Decisiones de trade-offs y por qué
Un MVP claro vs versión final

Si es posible, agrega también un diagrama conceptual o explicación tipo “system design interview”.

```



En el caso de haber agregado tests, estos son los prompts que hubiera utilizado para iniciar con los mismos:


### Prompt: Plan de Testing Completo



```
Crea un comprehensive test plan para la API de Northwind Collections Manager.

Requisitos:
- Unit tests (servicios, repositories)
- Integration tests (handlers, DB)
- E2E tests (flujos completos)
- Performance tests (carga)
- Security tests (validación, SQL injection)

Formato:
- Test scenario
- Expected behavior
- Test data needed
- Assertion

Endpoints a cubrir:
- GET /dashboard/metrics
- GET /dashboard/clients
- GET /clients/:id
- PATCH /clients/:id/status
- GET /clients/:id/invoices
- POST /invoices/:id/pay
- GET /clients/:id/risk
- GET /clients/:id/actions
- POST /clients/:id/actions

Incluir test cases positivos y negativos.
```

### Prompt: Frontend Testing Strategy

```
Crea estrategia de testing para el frontend React de Northwind.

Componentes a testear:
- Dashboard (view principal)
- ClientDetail (detail view)
- FilterBar
- Table (tabla genérica)
- Badges (estado, riesgo, segmento)
- Cards (KPI, contenedor)

Testing approach:
- Unit tests con Vitest
- Component tests con React Testing Library
- E2E tests con Cypress/Playwright
- Visual regression tests

Incluir:
- Test file structure
- Setup (mocks, fixtures)
- Sample test cases por componente
- Coverage targets (80%+)
```