const express = require("express");
const uuid = require("uuid");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;
const orders = [];

const checkOrderId = (request, response, next) => {
  const { id } = request.params;  

  const index = orders.findIndex( order => order.id === id);
  if (index < 0) {
    return response.status(404).json({ error: "order not found" })
  }

  request.orderIndex = index;
  request.orderId = id;    

  next();
}

app.get("/order", (request, response) => {  
  return response.json(orders);
})

app.post("/order", (request, response) => {  
    const { order, clientName, price } = request.body;
    const newOrder = { id: uuid.v4(), order, clientName, price, status: "Em preparação" };
  
    orders.push(newOrder);
    
    return response.status(201).json(newOrder);   
})

app.put("/order/:id", checkOrderId, (request, response) => {
  const index = request.orderIndex;
  const id = request.orderId;    
  const { order, clientName, price} = request.body;  
  const { status } = orders[index];
  const updatedOrder = { id, order, clientName, price, status};  

  orders[index] = updatedOrder;

  return response.json(updatedOrder);
})

app.delete("/order/:id", checkOrderId, (request, response) => {
  const index = request.userIndex;
  
  orders.splice(index, 1);
  return response.status(204).json();
})

app.patch("/order/:id", checkOrderId, (request, response) => {
  const index = request.orderIndex;
  const id = request.orderId;
  const { order, clientName, price } = orders[index];
  const orderReady = { id, order, clientName, price, status: "Pronto"};  

  orders[index] = orderReady;

  return response.json(orderReady);
})

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
})