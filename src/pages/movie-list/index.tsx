import React, { useState, useEffect } from 'react';

import {
    Container,
    Content,
    ContainerButtons,
    ContainerContent
} from './styles';

import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import HeaderApp from '../../components/header';
import { Button } from '@material-ui/core';
import moment from 'moment';
import api from '../../api/api';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@material-ui/data-grid';
toast.configure();

interface Genre {
    nome: string;
    id: number;
}

interface YearsOfMoviesExists {
    years: number[]
}

export default function ListMovie() {
    const [movies, setMovies] = useState([]);
    const [updateList, setUpdateList] = useState(false);
    const [years, setYears] = useState<YearsOfMoviesExists | null>(null);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [genreIdSelected, setGenreIdSelected] = useState<number | null>(null);
    const [yearSelected, setYearSelected] = useState<number>(0);

    const history = useHistory();

    useEffect(() => {
        async function getYears() {
            const response = await api.get(`movies/allYears`);
            setYears(response.data);
        }

        async function getGenres() {
            const response = await api.get(`Genres`);
            setGenres([{ nome: 'Todos', id: 0 }, ...response.data]);
        }

        getYears();
        getGenres();
    }, []);

    const columns = [
        { field: 'nome', headerName: 'Nome', width: 200, },
        { field: 'genreId', hide: true },
        {
            field: 'dataCriacao', headerName: 'Data de criação', width: 200,
            valueFormatter: (params: any) =>
                moment(params.row.dataCriacao).format('DD/MM/yyyy'),
        },

        { field: 'disponivel', headerName: 'Ativo', width: 130 },
        { field: 'genero', headerName: 'Gênero', width: 130 },
        {
            field: "",
            headerName: "",
            width: 130,
            renderCell: (params: any) => {
                const onClick = async () => {
                    await api.delete('movies', { params: { id: params.row.id } });
                    setUpdateList(true);
                    toast.success('Deletado com sucesso!');
                };

                return <Button onClick={onClick} style={{ width: 220 }} id="delete" variant="contained" color="secondary">
                    Excluir
                </Button>;
            }
        },
        {
            field: " ",
            headerName: "",
            width: 130,
            renderCell: (params: any) => {
                const onClick = () => {
                    history.push('/cadastro', { movie: params.row });
                };

                return <Button onClick={onClick} style={{ width: 220 }} id="edit" variant="contained" color="primary">
                    Editar
                </Button>;
            }
        },
    ];

    useEffect(() => {
        async function getMovies() {
            const response = await api.get(`Movies`);
            setMovies(response.data);
            setUpdateList(false);
        }

        getMovies();
    }, [updateList]);

    async function onChangeFilterYear(year: any) {
        let yearSelected = year.target.value == undefined ? null : new Date(year.target.value, 0);
        const response = await api.get(`Movies`, {
            params: {
                yearCreated: yearSelected,
                genreId: genreIdSelected == 0 ? null : genreIdSelected
            }
        });
        setYearSelected(year.target.value == undefined ? 0 : year.target.value);
        setMovies(response.data);
    }

    async function onChangeFilterGenre(genre: any) {
        let year = yearSelected == 0 ? null : new Date(yearSelected, 0);
        const response = await api.get(`Movies`, {
            params: {
                yearCreated: year,
                genreId: genre.target.value == 0 ? null : genre.target.value
            }
        });
    
        setGenreIdSelected(genre.target.value);
        setMovies(response.data);
    }

    return (
        <Container>
            <HeaderApp />

            <ContainerContent>
                <ContainerButtons>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: 320 }}>
                        <div>
                            <label style={{ marginBottom: 2}}>Gênero</label>
                            <select style={{ width: 120 }} onChange={onChangeFilterGenre}>
                                {genres.map((genre: Genre) => (
                                    <option selected={genre.id == 0} key={genre.id} value={genre.id}>{genre.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ marginBottom: 2}}>Ano de criação</label>
                            <select style={{ width: 120 }} onChange={onChangeFilterYear}>
                                <option selected={true} value={0}>Todos</option>
                                {years?.years.map((year: number) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <Link to="/cadastro">
                            <Button style={{ marginRight: 0, width: 180 }} variant="contained" color="primary">
                                Adicionar
                            </Button>
                        </Link>
                    </div>
                </ContainerButtons>

                <Content style={{ justifyContent: 'center' }}>
                    <DataGrid rows={movies} columns={columns} pageSize={5} />
                </Content>
            </ContainerContent>
        </Container>
    );
}