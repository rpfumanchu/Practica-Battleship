# Práctica Battleship JS

## Simulador del juego

- 2 Jugadores
- 2 tableros por jugador (el propio y el del adversario)
- Los tableros tendrán 10 filas y 10 columnas
- Las naves a colocar son las siguientes:
    - 1 Portaaviones (5 casillas)
    - 1 Buque (4 casillas)
    - 2 Submarinos (3 casillas)
    - 3 Cruceros (2 casillas)
    - 3 lanchas (1 casilla)
- La cantidad de disparos de cada jugador permitidos son 10 filas x 10 columnas =
100 disparos


## Está permitido:
- Se pueden poner barcos pegados entre sí, por ejemplo, tendríamos 1 submarino
vertical (A1, B1, C1) y 1 lancha pegada al lado (B2).

## No está permitido:
- La posición de los barcos en diferentes ejecuciones del simulador no puede
ser la misma. Tiene que haber un poco de aleatoriedad en la colocación de los
barcos. Por lo tanto, no puede ser que los barcos tengan siempre la misma
distribución en la parrilla.
- No se pueden solapar los barcos (es decir, una plaza ya ocupada por un barco no
puede ser ocupada por otro barco). Ya sé que los submarinos van por debajo del
agua, pero no cuela, no pueden solaparse.
- Las naves no pueden estar colocadas en diagonal, únicamente en horizontal o
en vertical.
- Las naves que ocupan más de 1 casilla, no pueden dividirse. Por ejemplo, no se
puede poner un portaaviones así (hay un salto de línea entre B y C

### Está permitido
- La selección de casillas oponentes de forma aleatoria, siempre y cuando respete el
siguiente punto (no permitido)
### No está permitido
- Seleccionar casillas de barcos directamente del oponente. Esto sería hacer
trampas, mirar el tablero del oponente para saber dónde están sus naves…
- Seleccionar casillas que ya han sido seleccionadas previamente. No podéis
disparar ahí donde habéis disparado.
- No puede haber transiciones extrañas, como que un barco reflote. Las
transiciones que puede tener una casilla son
    - Vacío → tocado
    - Vacío → agua
    - Barco → tocado
    - Tocado → hundido



# Requisitos del programa mínimo
- El programa debe tener un index.js que será lo que ejecutaré
- El programa empieza con una frase indicando que empieza el juego (el idioma no
importa)
- Las casillas deben tener los siguientes posibles representaciones (podéis usar
cualquier representación que queráis siempre y cuando sean diferentes entre sí):
    - vacío
    - agua
    - barco (puede ser una única para todos los barcos o diferente para cada tipo
de barco)
    - tocado
- El programa deberá mostrar la colocación de las naves en el tablero propio del
Jugador 1 y a continuación mostrar las naves del tablero propio del Jugador 2
- El programa deberá mostrar una frase indicando que empiezan las rondas
- Para cada turno, deberá mostrarse claramente el turno del jugador X
- Para cada disparo, se deberá mostrar la casilla seleccionada, los disparos que faltan
del jugador, y los tableros del jugador que está disparando (el propio y el ajeno) con
la casilla ya marcada, sea agua o tocado.
- Cuando termine la partida, deberá mostrarse por pantalla qué jugador ha ganado.
- Deberá mostrarse también por pantalla el tablero propio del jugador 1 y el tablero
propio del jugador 2, para poder visualizar los barcos que han quedado sin hundir