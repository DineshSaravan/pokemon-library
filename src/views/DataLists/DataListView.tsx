import React, {FC} from "react";

import "./DataListView.scss";

// GraphQL API retrieving data
import pokeApi from "../../api";
import {useEffect, useState, useCallback} from "react";
import {pokeAttackData, PokemonDetails, PokemonMetaData} from "../../common/pokemon-interface";
import {pokemonsListQuery} from "../../query";
import {
    Badge,
    Button,
    Card,
    Image,
    ListGroup,
    ListGroupItem,
    Modal,
    ProgressBar, Table
} from "react-bootstrap";
import {BadgePillStyle, PokemonTypes} from "../../common/PokemonTypes";
import {useHistory} from "react-router";

export const DataListView: FC = () => {
    const [modalShow, setModalShow] = useState<boolean>(false);
    const [pokemonInfo, setPokemonInfo] = useState<PokemonDetails | undefined>(undefined);
    const [pokemonList, setPokemons] = useState<PokemonMetaData[]>([]);
    const history = useHistory();

    const fetchData = useCallback(() => {
        fetch(pokeApi.baseUrl, {
            method: "POST",
            headers: pokeApi.headers,
            body: JSON.stringify(pokemonsListQuery)
        })
            .then(response => response.json())
            .then(data => {
                setPokemons(data.data.pokemons);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    function badgeType(pokemonType: string): string {
        switch (pokemonType) {
            case PokemonTypes.BUG:
                return BadgePillStyle.SECONDARY;
            case PokemonTypes.GRASS:
                return BadgePillStyle.SUCCESS;
            case PokemonTypes.NORMAL:
                return BadgePillStyle.PRIMARY;
            case PokemonTypes.POISON:
                return BadgePillStyle.WARNING;
            case PokemonTypes.FIRE:
                return BadgePillStyle.DANGER;
            case PokemonTypes.WATER:
                return BadgePillStyle.INFO;
            case PokemonTypes.GHOST:
                return BadgePillStyle.DARK;
            default:
                return BadgePillStyle.PRIMARY;
        }
    }

    function getPokeInfo(pokeId: string): void {
        const pokemonDataQuery = {
            query: `
                {
                  pokemon(id: "${pokeId}") {
                    id
                    number
                    name
                    image
                    types
                    resistant
                    weaknesses
                    attacks {
                      special {
                        name
                        type
                        damage
                      }
                      fast {
                        name
                        type
                        damage
                      }
                    }
                  }
                }
            `,
        };
        fetch(pokeApi.baseUrl, {
            method: "POST",
            headers: pokeApi.headers,
            body: JSON.stringify(pokemonDataQuery)
        })
            .then(response => response.json())
            .then(data => {
                const pokeNum: number = data.data.pokemon.number;
                setPokemonInfo(data.data.pokemon);
                setModalShow(true)
                history.push( `/pokemons/${pokeNum}`);
            })
            .catch(err => {
                console.log(err);
                setModalShow(false)
            });
    }

    const renderAttackInfo = (attackInfo: pokeAttackData): JSX.Element => {
        return (
            <div className="attack-info-container">
                <label className="attack-label">{attackInfo.name}</label>
                <Badge className="attack-type">{attackInfo.type}</Badge>
                <ProgressBar className="attack-damage-bar" now={attackInfo.damage} label={`${attackInfo.damage}%`} />
            </div>
        );
    };

    const renderListGroupInfo = (title: string, listItems: string[] | undefined, variant: string): JSX.Element => {
        return (
            <ListGroup as="ul" className="list-container">
                <ListGroupItem as="li" active variant={variant}>
                    {title}
                </ListGroupItem>
                {listItems?.map(value => {
                    return <ListGroupItem as="li">
                        {value}
                    </ListGroupItem>
                })}
            </ListGroup>
        );
    };

    function getPreviousPokemon(pokeNumber: number | undefined): void {
        let pokePosition: number = pokemonList.findIndex((value => value.number === pokeNumber));
        getPokeInfo(pokemonList.slice(--pokePosition)[0].id)
    }

    function getNextPokemon(pokeNumber: number | undefined): void {
        let pokePosition: number = pokemonList.findIndex((value => value.number === pokeNumber));
        getPokeInfo(pokemonList.slice(++pokePosition)[0].id)
    }

    function PokeInfoModal(props: any) {
        return (
            <Modal
                {...props}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton closeLabel="">
                    <Modal.Title id="contained-modal-title-vcenter">
                        {pokemonInfo?.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-content-container">
                        <div className="image-container">
                            <Image src={pokemonInfo?.image} fluid />
                        </div>
                        <div className="info-container">
                            <div>
                                <ListGroup as="ul" className="list-container">
                                    <ListGroupItem as="li" active>
                                        {`Attacks`}
                                    </ListGroupItem>
                                </ListGroup>
                                <h6>Fast:</h6>
                                {pokemonInfo?.attacks.fast.map(value => {
                                    return renderAttackInfo(value);
                                })}
                                <h6>Special:</h6>
                                {pokemonInfo?.attacks.special.map(value => {
                                    return renderAttackInfo(value);
                                })}
                            </div>
                            <div className="horiz-align">
                                {renderListGroupInfo("Resistant", pokemonInfo?.resistant, "success")}
                                {renderListGroupInfo("Weaknesses", pokemonInfo?.weaknesses, "secondary")}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="">
                        <Button
                            className="footer-button"
                            disabled={pokemonInfo?.number.toString() === "001"}
                            onClick={() => getPreviousPokemon(pokemonInfo?.number)}>
                            {`<- Previous`}
                        </Button>
                        <Button
                            className="footer-button"
                            disabled={pokemonInfo?.number.toString() === "150"}
                            onClick={() => getNextPokemon(pokemonInfo?.number)}>
                            {`Next ->`}
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }

  return (
      <>
          <div className="content-card-collection">
              {pokemonList.map((value: PokemonMetaData, index) => {
                  return <Card border="primary" className="content-card"
                               onClick={() => getPokeInfo(value.id)}>
                      <Card.Img
                          className="content-card-image"
                          variant="top"
                          src={value.image} />
                      <Card.Body>
                          <Card.Title>{value.name}</Card.Title>
                          <Card.Text>
                              #{value.number}
                          </Card.Text>
                          <div>
                              {value.types.map((pokeType, index) => {
                                  return <Badge pill variant={badgeType(pokeType)}>
                                      {pokeType}
                                  </Badge>
                              })}
                          </div>
                      </Card.Body>
                  </Card>
              })}
          </div>
          <PokeInfoModal
              show={modalShow}
              onHide={() => {history.push(`/pokemons/`); setModalShow(false)}}
          />
      </>
  );
};

export default DataListView;
