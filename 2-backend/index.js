const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const prisma = require("./prisma/client")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Backend da AutoFlex está online e operante!')
});

// criar uma nova matéria-prima
app.post('/raw-materials', async function(req, res){
   const { name, stock_quantity } = req.body;
   const material = await prisma.rawMaterial.create({
    data: { name, stock_quantity: parseFloat(stock_quantity) }
  });
  res.status(201).json(material);
})

// listar todas as matérias-primas
app.get('/raw-materials', async function (req, res){
  const materials = await prisma.rawMaterial.findMany()
  res.json(materials);
})

// atualizar matéria-prima
app.put('/raw-materials/:id', async (req, res) => {
  const { id } = req.params;
  const { name, stock_quantity } = req.body;
  const updated = await prisma.rawMaterial.update({
    where: { id: parseInt(id) },
    data: { name, stock_quantity: parseFloat(stock_quantity) }
  });
  res.json(updated);
});

// deletar matéria-prima
app.delete('/raw-materials/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.rawMaterial.delete({
    where: { id: parseInt(id) }
  });
  res.status(204).send(); // 204 significa "Sucesso, mas sem conteúdo para retornar"
});
 

// criar produto
app.post('/products', async function(req, res){
  const { name, price } = req.body;
  const product = await prisma.product.create({
    data: { name, price: parseFloat(price) }
  });
  res.status(201).json(product);
});


// listar produtos
app.get('/products', async function(req, res){
  const products = await prisma.product.findMany({
    include: { materials: { include: { raw_material: true } } }
  });
  res.json(products);
});

// atualizar produto
app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const updated = await prisma.product.update({
    where: { id: parseInt(id) },
    data: { name, price: parseFloat(price) }
  });
  res.json(updated);
});

// deletar produto
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.product.delete({
    where: { id: parseInt(id) }
  });
  res.status(204).send();
});

// associar material ao produto
app.post('/products/:id/materials', async function(req, res){
  const { id } = req.params;
  const { raw_material_id, needed_quantity } = req.body;

  const association = await prisma.productMaterial.create({
    data: {
      product_id: parseInt(id),
      raw_material_id: parseInt(raw_material_id),
      needed_quantity: parseFloat(needed_quantity)
    }
  });
  res.status(201).json(association);
});

// ATUALIZAR a quantidade de um material em um produto (Update do RF003)
app.put('/product-materials/:id', async (req, res) => {
  const { id } = req.params;
  const { needed_quantity } = req.body;

  try {
    const updated = await prisma.productMaterial.update({
      where: { id: parseInt(id) },
      data: { needed_quantity: parseFloat(needed_quantity) }
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar quantidade do material no produto." });
  }
});

// REMOVER um material de um produto (Delete do RF003)
app.delete('/product-materials/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.productMaterial.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Erro ao remover material do produto." });
  }
});

// app.get('/production-suggestion', async function(req, res){
//   // busca produtos ordenados pelo maior preço (Requisito de priorização)
//   const products = await prisma.product.findMany({
//     orderBy: { price: 'desc' },
//     include: { materials: { include: { raw_material: true } } }
//   });

//   // busca estoque atual e cria um mapa temporário para simulação
//   const rawMaterials = await prisma.rawMaterial.findMany();
//   let tempStock = {};
//   rawMaterials.forEach(m => tempStock[m.id] = m.stock_quantity);

//   let productionPlan = [];
//   let totalRevenue = 0;

//   // lógica de simulação de produção
//   products.forEach(product => {
//     let possibleToProduce = true;
//     let amountProduced = 0;

//     // tenta produzir unidades enquanto houver estoque
//     while (possibleToProduce) {
//       // verifica se todos os ingredientes estão disponíveis para 1 unidade
//       for (const item of product.materials) {
//         if (tempStock[item.raw_material_id] < item.needed_quantity) {
//           possibleToProduce = false;
//           break;
//         }
//       }

//       if (possibleToProduce) {
//         // deduz do estoque temporário e incrementa produção
//         product.materials.forEach(item => {
//           tempStock[item.raw_material_id] -= item.needed_quantity;
//         });
//         amountProduced++;
//       }
//     }

//     if (amountProduced > 0) {
//       productionPlan.push({
//         productId: product.id,
//         productName: product.name,
//         quantity: amountProduced,
//         unitValue: product.price,
//         subtotal: amountProduced * product.price
//       });
//       totalRevenue += (amountProduced * product.price);
//     }
//   });

//   res.json({ productionPlan, totalRevenue });
// });


// No Backend (atendendo RF004 e RF007 em Inglês)
app.get('/production-suggestion', async (req, res) => {
  // Busca produtos ordenados pelo maior preço (Requisito RF004) [cite: 7, 16]
  const products = await prisma.product.findMany({
    orderBy: { price: 'desc' },
    include: { materials: { include: { raw_material: true } } }
  });

  let tempStocks = {}; // Simulação temporária de estoque
  const productionPlan = [];
  let totalRevenue = 0;

  // Inicializa o estoque temporário
  const allMaterials = await prisma.rawMaterial.findMany();
  allMaterials.forEach(m => tempStocks[m.id] = m.stock_quantity);

  for (const product of products) {
    let canProduce = true;
    let amountProduced = 0;

    // Tenta produzir o máximo possível deste produto específico
    while (canProduce) {
      for (const item of product.materials) {
        if (tempStocks[item.raw_material_id] < item.needed_quantity) {
          canProduce = false;
          break;
        }
      }

      if (canProduce) {
        amountProduced++;
        // Subtrai do estoque temporário da simulação
        product.materials.forEach(item => {
          tempStocks[item.raw_material_id] -= item.needed_quantity;
        });
      }
    }

    if (amountProduced > 0) {
      productionPlan.push({
        productId: product.id,
        productName: product.name,
        quantity: amountProduced,
        subtotal: amountProduced * product.price
      });
      totalRevenue += (amountProduced * product.price);
    }
  }

  res.json({ productionPlan, totalRevenue });
});



// rota para efetivar a produção (dar baixa no estoque)
app.post('/produce/:id', async (req, res) => {
  const { id } = req.params; // ID do produto
  const { quantity } = req.body; // quantidade a produzir

  // busca a composição do produto
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: { materials: true }
  });

  // atualiza cada material no banco de dados
  for (const item of product.materials) {
    await prisma.rawMaterial.update({
      where: { id: item.raw_material_id },
      data: {
        stock_quantity: { decrement: item.needed_quantity * quantity }
      }
    });
  }

  res.json({ message: "Produção confirmada e estoque atualizado!" });
});


app.listen(PORT, function(){
    console.log(`Servidor rodando na porta http://localhost:${PORT}`)
})