# unidad
```erDiagram
    programas {
        SERIAL programa_id PK
        VARCHAR(100) nombre_programa
        VARCHAR(50) snies_programa
    }

    estudiantes {
        VARCHAR(20) cedula_estudiantes PK
        VARCHAR(20) tipo_documento
        VARCHAR(50) apellido1
        VARCHAR(50) apellido2
        VARCHAR(50) nombre1
        VARCHAR(50) nombre2
        VARCHAR(20) telefono
        VARCHAR(100) direccion
        VARCHAR(100) correo
        INT programa_id
    }
    
    estudiantes_activos {
        VARCHAR(20) cedula_estudiantes_activos PK
        VARCHAR(50) apellido1
        VARCHAR(50) apellido2
        VARCHAR(50) nombre1
        VARCHAR(50) nombre2
        VARCHAR(20) telefono
        VARCHAR(20) estado_u
        VARCHAR(20) jornada
        VARCHAR(100) sheetname
        VARCHAR(100) filename
    }
    
    estudiantes_egresados {
        VARCHAR(20) cedula_estudiantes_egresados PK
        INT acta_grado_no
        INT libro_grado_no
        INT folio_no
        INT titulo
        DATE dia_graduacion
        VARCHAR(50) snies_programa
    }
    
    estudiantes_potenciales {
        VARCHAR(20) cedula_estudiantes_potenciales PK
        INT programa_id
        INT agente_id
    }

    estudiantes_moodle {
        VARCHAR(20) cedula_estudiantes_moodle PK
        INT programa_id
    }

    inscripciones {
        SERIAL inscripcion_id PK
        VARCHAR(20) cedula_inscripciones
        INT programa_id
        DATE fecha_inscripcion
        VARCHAR(20) jornada
    }

    agentes {
        SERIAL agente_id PK
        VARCHAR(100) nombre_agente
    }

    estudiantes ||--o| programas : "programa_id"
    estudiantes_activos ||--o| estudiantes : "cedula_estudiantes_activos"
    estudiantes_egresados ||--o| estudiantes : "cedula_estudiantes_egresados"
    estudiantes_egresados ||--o| programas : "titulo"
    estudiantes_potenciales ||--o| estudiantes : "cedula_estudiantes_potenciales"
    estudiantes_potenciales ||--o| programas : "programa_id"
    estudiantes_potenciales ||--o| agentes : "agente_id"
    estudiantes_moodle ||--o| estudiantes : "cedula_estudiantes_moodle"
    estudiantes_moodle ||--o| programas : "programa_id"
    inscripciones ||--o| estudiantes : "cedula_inscripciones"
    inscripciones ||--o| programas : "programa_id"
```


## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
