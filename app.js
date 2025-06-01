const API_URL = 'http://IP_DA_VM_BACKEND:3000/produtos';
const form = document.getElementById('formProduto');
const lista = document.getElementById('listaProdutos');
const mensagem = document.getElementById('mensagem');

let produtoEditando = null;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const produto = {
    nome: form.nome.value,
    descricao: form.descricao.value,
    preco: parseFloat(form.preco.value),
    estoque: parseInt(form.estoque.value)
  };

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produto)
  });

  form.reset();
  showMensagem('Produto cadastrado com sucesso!');
  carregarProdutos();
});

async function carregarProdutos() {
  lista.innerHTML = '';
  const res = await fetch(API_URL);
  const produtos = await res.json();

  produtos.forEach(p => {
    const card = document.createElement('div');
    card.className = 'produto';
    card.innerHTML = `
      <h3>${p.nome}</h3>
      <p><strong>Descrição:</strong> ${p.descricao}</p>
      <p><strong>Preço:</strong> R$${p.preco}</p>
      <p><strong>Estoque:</strong> ${p.estoque}</p>
      <div class="botoes">
        <button onclick="abrirModalEdicao('${p.id}', '${p.nome}', '${p.descricao}', ${p.preco}, ${p.estoque})">Editar</button>
        <button onclick="deletarProduto('${p.id}')">Deletar</button>
      </div>
    `;
    lista.appendChild(card);
  });
}

async function deletarProduto(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  showMensagem('Produto deletado.');
  carregarProdutos();
}

function abrirModalEdicao(id, nome, descricao, preco, estoque) {
  produtoEditando = id;
  document.getElementById('editNome').value = nome;
  document.getElementById('editDescricao').value = descricao;
  document.getElementById('editPreco').value = preco;
  document.getElementById('editEstoque').value = estoque;
  document.getElementById('modalEdicao').style.display = 'flex';
}

document.getElementById('btnSalvarEdicao').onclick = async () => {
  const produtoAtualizado = {
    nome: document.getElementById('editNome').value,
    descricao: document.getElementById('editDescricao').value,
    preco: parseFloat(document.getElementById('editPreco').value),
    estoque: parseInt(document.getElementById('editEstoque').value),
  };

  await fetch(`${API_URL}/${produtoEditando}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produtoAtualizado)
  });

  document.getElementById('modalEdicao').style.display = 'none';
  showMensagem('Produto atualizado com sucesso!');
  carregarProdutos();
};

document.getElementById('btnCancelarEdicao').onclick = () => {
  document.getElementById('modalEdicao').style.display = 'none';
};

function showMensagem(texto) {
  mensagem.textContent = texto;
  setTimeout(() => mensagem.textContent = '', 3000);
}

carregarProdutos();
