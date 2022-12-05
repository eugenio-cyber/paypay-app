const express = require("express");
const routes = express();
const filters = require("./filters");
const users = require("./controllers/users");
const clients = require("./controllers/clients");
const charges = require("./controllers/charges");

routes.post("/login", users.userLogin);
routes.post("/users", filters.verifyOnCreateUser, users.createUser);

routes.use(filters.verifyLogin);

routes.get("/client/:id/charge", clients.clientCharges);
routes.get("/clients/:id", clients.detailCLient);
routes.get("/clients", clients.listClients);
routes.get("/panel/clients", clients.panelClients);
routes.post("/clients", filters.verifyOnRegisterClient, clients.registerClient);
routes.patch(
	"/clients/:id",
	filters.verifyOnUpdateClient,
	clients.updateClient
);
routes.delete("/clients/:id", clients.deleteClient);
routes.get("/users", users.getUserProfile);
routes.patch("/users", filters.verifyOnUpdateUser, users.updateUser);
routes.delete("/users/:id", users.deleteUser);

routes.get("/status/charges", charges.filterCharges);
routes.get("/charges", charges.listCharges);
routes.get("/panel/charges", charges.panelCharges);
routes.post("/charges", charges.registerCharge);
routes.patch("/charges/:id", charges.updateCharge);
routes.delete("/charges/:id", charges.deleteCharge);

module.exports = routes;
