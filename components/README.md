# Componente: FormularioPaciente

Este componente ha sido diseñado para la captura inicial de datos de pacientes en el landing de DocTree. Es un componente de cliente (`'use client'`) diseñado para ser reutilizado en la aplicación principal.

## Uso

El componente requiere obligatoriamente la propiedad `onSubmit`, la cual debe manejar la lógica de persistencia de datos (ej. inserción en Supabase).

### Definición de props
```typescript
interface Props {
  onSubmit: (datos: DatosPaciente) => Promise<void>;
}
