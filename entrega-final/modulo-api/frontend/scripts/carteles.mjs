// Busca en TMDB el afiche de cada pelicula y guarda su ruta en src/carteles.json.
// Solo se ejecuta una vez; el front despues lee el JSON y no necesita la clave.
// Uso, desde entrega-final/modulo-api/frontend:
//   node --env-file=../../script-integracion/.env scripts/carteles.mjs
import { writeFileSync } from 'node:fs'

// id_pelicula de PostgreSQL, titulo original y anio de estreno
const PELICULAS = [
  [1, 'Dune', 2021],
  [2, 'Dune: Part Two', 2024],
  [3, 'Star Wars: The Force Awakens', 2015],
  [4, 'Star Wars: The Last Jedi', 2017],
  [5, 'Coco', 2017],
  [6, 'Oppenheimer', 2023],
  [7, 'Interstellar', 2014],
  [8, 'Inside Out 2', 2024],
  [9, 'Avatar: The Way of Water', 2022],
  [10, 'Barbie', 2023],
  [11, 'Avengers: Endgame', 2019],
  [12, 'Spider-Man: No Way Home', 2021],
  [13, 'Top Gun: Maverick', 2022],
  [14, 'Jurassic World Dominion', 2022],
  [15, 'Toy Story 4', 2019],
  [16, 'Frozen II', 2019],
  [17, 'The Lion King', 2019],
  [18, 'Mission: Impossible - Dead Reckoning Part One', 2023],
  [19, 'Guardians of the Galaxy Vol. 3', 2023],
  [20, 'Wonka', 2023],
  [21, 'The Super Mario Bros. Movie', 2023],
  [22, 'Joker', 2019],
  [23, 'Tenet', 2020],
  [24, 'La La Land', 2016],
  [25, 'Incredibles 2', 2018],
  [26, 'Encanto', 2021],
  [27, 'Gravity', 2013],
  [28, 'Moana 2', 2024],
  [29, 'Wicked', 2024],
  [30, 'Mission: Impossible - The Final Reckoning', 2025],
]

const token = process.env.TMDB_TOKEN
if (!token) {
  console.error('Falta TMDB_TOKEN en el archivo .env de script-integracion.')
  process.exit(1)
}

const carteles = {}
const faltantes = []

for (const [id, titulo, anio] of PELICULAS) {
  const url = new URL('https://api.themoviedb.org/3/search/movie')
  url.search = new URLSearchParams({ query: titulo, primary_release_year: anio, language: 'es-MX' })
  const respuesta = await fetch(url, { headers: { Authorization: `Bearer ${token}`, accept: 'application/json' } })
  if (!respuesta.ok) {
    console.error(`TMDB respondio ${respuesta.status}. Revisa que TMDB_TOKEN sea el "API Read Access Token".`)
    process.exit(1)
  }
  const { results } = await respuesta.json()
  const encontrada = results.find((pelicula) => pelicula.poster_path)
  if (!encontrada) {
    faltantes.push(`${id} ${titulo}`)
    continue
  }
  carteles[id] = encontrada.poster_path
  console.log(`${String(id).padStart(2)}  ${titulo} (${anio})  ->  ${encontrada.title} (${encontrada.release_date})`)
}

writeFileSync(new URL('../src/carteles.json', import.meta.url), JSON.stringify(carteles, null, 2) + '\n')
console.log(`\nGuardados ${Object.keys(carteles).length} afiches en src/carteles.json`)
if (faltantes.length) console.log(`Sin afiche: ${faltantes.join(', ')}`)
