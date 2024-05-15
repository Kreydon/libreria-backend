const express = require("express");
const router = express.Router();
const {
  readOrderIDController,
  filterOrdersByDateController,
  filterOrdersByStateController,
  readOrdersController,
  createOrderController,
  updateOrderController,
  deleteOrderController,
} = require("../controllers/Orders.controllers");

async function getOrderIDRoute(req, res) {
  try {
    const order = await readOrderIDController(req.params.id);
    res.status(200).json({ ...order });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

async function getOrdersByDateRoute(req, res) {
  try {
    const { startDate, endDate } = req.query;
    const orders = await filterOrdersByDateController(startDate, endDate);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

async function getOrdersByStateRoute(req, res) {
  try {
    const { state } = req.query;
    const orders = await filterOrdersByStateController(state);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

async function getOrdersRoute(req, res) {
  try {
    const orders = await readOrdersController();
    res.status(200).json({ ...orders });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

async function postOrdersRoute(req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const orders = await createOrderController(req.body, token);
    if (orders.modifiedCount === 0) {
      throw new Error("It wasn't possible to create the order");
    }
    res.status(200).json({
      mensaje: "The order has been successfully created",
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

async function patchOrdersRoute(req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      throw new Error("Authorization token wasn't provided");
    }

    const orders = await updateOrderController(req.params.id, req.body, token);
    if (!orders) {
      throw new Error("Due to permissions, the order could not be updated");
    }
    if (orders.modifiedCount === 0) {
      throw new Error("The order could not be updated");
    }
    res.status(200).json({
      mensaje: "The order has been successfully updated",
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

async function deleteOrdersRoute(req, res) {
  try {
    const orderID = req.params.id;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw new Error("Authorization token wasn't provided");
    }
    if (!orderID) {
      throw new Error("Order ID wasn't provided");
    }
    const orders = await deleteOrderController(orderID, token);
    if (orders.modifiedCount === 0) {
      throw new Error("It wasn't possible to deleted the order");
    }
    res
      .status(200)
      .json({ mensaje: "The order has been successfully deleted" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

router.get("/:id", getOrderIDRoute);
router.get('/orders/:date', getOrdersByDateRoute);
router.get('/orders/:state', getOrdersByStateRoute);
router.get("/", getOrdersRoute);
router.post("/", postOrdersRoute);
router.patch("/:id", patchOrdersRoute);
router.delete("/:id", deleteOrdersRoute);

module.exports = router;
