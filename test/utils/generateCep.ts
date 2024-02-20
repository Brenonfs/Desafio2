import axios from 'axios';
// Função para obter um logradouro aleatório de uma array de logradouros
function getRandomLogradouro(logradouros: string[]): string {
  const randomIndex = Math.floor(Math.random() * logradouros.length);
  return logradouros[randomIndex];
}
function getRandomEstado(estados: string[]): string {
  const randomIndex = Math.floor(Math.random() * estados.length);
  return estados[randomIndex];
}

export async function getRandomCep(): Promise<string> {
  const estados = ['MG', 'SP', 'BA', 'RJ', 'RS']; // estados desejados
  const logradouros = ['lima', 'avenida', 'rua', 'praça', 'dois', 'tres', 'quatro', 'cinco', 'seis', 'sete'];
  const tipo = 'json'; // formato desejado (json)

  try {
    const estado = getRandomEstado(estados);
    let cidade;

    if (estado === 'MG') {
      cidade = 'Belo%20Horizonte';
    } else if (estado === 'SP') {
      cidade = 'Sao%20Paulo';
    } else if (estado === 'RJ') {
      cidade = 'Rio%20de%20Janeiro';
    } else if (estado === 'RS') {
      cidade = 'Porto%20Alegre';
    } else if (estado === 'BA') {
      cidade = 'Salvador';
    }

    const logradouro = getRandomLogradouro(logradouros);
    const response = await axios.get(`https://viacep.com.br/ws/${estado}/${cidade}/${logradouro}/${tipo}/`);
    if (response.data && response.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * response.data.length);
      return response.data[randomIndex].cep;
    }

    throw new Error('Não foi possível obter um CEP válido.');
  } catch (error) {
    console.error('Ocorreu um erro ao obter o CEP:', error);
    throw new Error('Não foi possível obter um CEP válido.');
  }
}
