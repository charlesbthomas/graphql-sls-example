import fetch from 'node-fetch';

const getUserByLogin = async (login) => fetch(`https://api.github.com/users/${login}`).then(resp => resp.json());

export default { getUserByLogin };
