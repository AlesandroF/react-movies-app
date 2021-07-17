import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { TextField } from 'final-form-material-ui';
import {
  Paper,
  Grid,
  Button
} from '@material-ui/core';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import moment from 'moment';

import HeaderApp from '../../components/header';
import api from '../../api/api';

import {
  Container,
  Content,
  ContainerContent,
  TextTitle,
  ContainerText
} from './styles';

import { Field, Form } from 'react-final-form';
import DateFnsUtils from '@date-io/date-fns';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

interface Movie {
  nome: string;
  ativo: boolean;
  dataCriacao: Date;
  genero: string;
  genreId: number;
}

interface Genre {
  nome: string;
  id: number;
}

export default function RegisterMovie() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [movie, setMovie] = useState<Movie | undefined>({} as Movie);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [editing, setEditing] = useState(false);

  const history = useHistory();
  const location = useLocation<any>();

  useEffect(() => {
    if (location.state !== undefined) {
      setMovie({
        nome: location.state.movie.nome,
        ativo: location.state.movie.disponivel === 'SIM',
        dataCriacao: new Date(location.state.movie.dataCriacao),
        genero: location.state.movie.genero,
        genreId: location.state.movie.genreId,
      });
      setSelectedDate(new Date(location.state.movie.dataCriacao));
      setEditing(true);
    }

    async function getGenres() {
      const response = await api.get(`Genres`);
      const genres = response.data;
      setGenres(genres);
    }

    getGenres();
  }, []);

  async function onSubmit(values: any) {
    values.preventDefault();
    
    if (editing) {
      let movie = {
        id: location.state.movie.id,
        nome: values.target.nome.value,
        dataCriacao: moment(selectedDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        genreId: values.target.genreId.value,
        ativo: values.target.ativo.value
      };

      try {
        await api.put('movies', movie)
          .then(() => {
            toast.success('Alterado com sucesso!');
            history.push('/');
          }).catch(err => {
            toast.error('Aconteceu algum erro ao alterar o filme');
          });
      } catch (error) {
        toast.error('Erro!');
      }
    }
    else {
      let movie = {
        nome: values.target.nome.value,
        dataCriacao: moment(selectedDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        genreId: values.target.genreId.value,
        ativo: 1
      };

      try {
        await api.post('movies', movie)
          .then((response) => {
            toast.success('Salvo com sucesso!');
            history.push('/');
          }).catch(err => {
            toast.error('Filme já cadastrado');
          });
      } catch (error) {
        toast.error('Erro!');
      }
    }
  };

  const validate = (values: any) => {
    const errors = {} as Movie;
    if (!values.nome) {
      errors.nome = 'Obrigatório';
    }
    if (values.nome && values.nome.length > 200) {
      errors.nome = 'Tamanho máximo de 200 caracteres';
    }
    if (!values.genreId) {
      errors.genero = 'Obrigatório';
    }
    return errors;
  };

  const handleDateChange = (date: any) => {
    setSelectedDate(new Date(date));
  };

  return (
    <Container>
      <HeaderApp />

      <ContainerContent>
        <ContainerText>
          {editing ?
            <TextTitle>Edite seu filme</TextTitle> :
            <TextTitle>Cadastre seu filme</TextTitle>
          }
        </ContainerText>

        <Content>
          <Form
            onSubmit={onSubmit}
            validate={validate}
            render={({ handleSubmit }) => (
              <form onSubmit={onSubmit} noValidate>
                <Paper style={{ padding: 16 }}>
                  <Grid container alignItems="center" style={{ width: 800 }} spacing={4}>
                    <Grid item xs={12}>
                      <Field
                        required
                        name="nome"
                        component={TextField}
                        type="text"
                        label="Nome"
                        initialValue={movie ? movie.nome : ''}
                      />
                    </Grid>

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <Grid container justify="flex-start" style={{ marginLeft: 16 }}>
                        <KeyboardDatePicker
                          disableToolbar
                          variant="inline"
                          format="dd/MM/yyyy"
                          margin="normal"
                          id="date-picker-inline"
                          label="Data de criação"
                          value={selectedDate}
                          onChange={handleDateChange}
                          autoOk={true}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                        />
                      </Grid>
                    </MuiPickersUtilsProvider>

                    <Grid item xs={12}>
                      <label style={{ marginRight: 8 }}>Selecione o gênero:</label>
                      <Field
                        name="genreId"
                        component="select"
                        initialValue={movie?.genreId}
                      >
                        {genres.map((genre: Genre) => (
                          <option key={genre.id} value={genre.id}>{genre.nome}</option>
                        ))}
                      </Field>
                    </Grid>

                    {editing &&
                      <Grid item xs={12}>
                        <label style={{ marginRight: 22 }}>Ative ou desative:</label>
                        <Field
                          name="ativo"
                          component="select"
                          initialValue={movie?.ativo ? 1 : 0}
                        >
                          <option value={1}>SIM</option>
                          <option value={0}>NÃO</option>
                        </Field>
                      </Grid>
                    }

                    <Grid item style={{ marginTop: 16 }}>
                      <Button
                        variant="contained"
                        color="default"
                        type="submit"
                        style={{ width: 130 }}
                        onClick={() => history.push('/')}
                      >
                        Voltar
                      </Button>
                    </Grid>

                    <Grid item style={{ marginTop: 16 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        style={{ width: 130 }}
                      >
                        Salvar
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </form>
            )}
          />
        </Content>
      </ContainerContent>
    </Container>
  );
}