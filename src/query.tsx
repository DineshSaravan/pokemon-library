import {PokemonCount} from "./common/pokemon-interface";

export const pokemonsListQuery = {
    query: `
        {
          pokemons(first: ${PokemonCount}) {
            id
            number
            name
            image
            types
          }
        }
    `,
};
