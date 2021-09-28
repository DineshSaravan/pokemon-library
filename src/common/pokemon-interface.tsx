export const PokemonCount: number = 150;

export interface PokemonMetaData {
    id: string,
    number: number,
    name: string,
    image: string,
    types: string[]
}

export interface pokeAttackData {
    name: string,
    type: string,
    damage: number
}

export interface pokeAttack {
    special: pokeAttackData[],
    fast: pokeAttackData[]
}

export interface PokemonDetails {
    id: string,
    number: number,
    name: string,
    image: string,
    types: string[],
    resistant: string[],
    weaknesses: string[],
    attacks: pokeAttack
}
