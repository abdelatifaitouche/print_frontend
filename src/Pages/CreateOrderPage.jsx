import axios from "axios";
import React, { useState } from "react";

function CreateOrderPage() {
  const [order, setOrder] = useState({ items: [], user: 1, company: 1 });

  const addOrderItem = () => {
    setOrder((prev) => ({
      ...prev,
      items: [...prev.items, { item_name: "", file: null }],
    }));
    console.log(order);
  };

  const updateItemData = (index, field, value) => {
    const updatedItem = [...order.items];
    updatedItem[index][field] = value;

    setOrder((prev) => ({ ...prev, items: updatedItem }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(order)
    try {
      axios
        .post("http://127.0.0.1:8000/api/v1/orders/ordersList/", order , {
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((response) => {
          console.log(response);
        })
        .catch((errors) => {
          console.log(errors);
        });
    } catch (errors) {
      console.log(errors);
    }
  };

  return (
    <div className="p-4">
      Create order
      <button onClick={addOrderItem}>add</button>
      <form enctype="multipart/form-data" onSubmit={handleSubmit}>
        {order.items &&
          order.items.map((item, index) => {
            return (
              <OrderItemForm
                key={index}
                item={item}
                index={index}
                updateItemData={updateItemData}
              />
            );
          })}
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreateOrderPage;

function OrderItemForm({ item, index, updateItemData }) {
  return (
    <div className="flex gap-2">
      <input
        placeholder="item name"
        value={item.item_name}
        onChange={(e) => {
          updateItemData(index, "item_name", e.target.value);
        }}
      />

      <input id="file" type="file" onChange={(e)=>{
        console.log(e.target.files[0])
        updateItemData(index , 'file' , e.target.files[0])
      }} />
    </div>
  );
}

/**
 * Order :  {
            "id": 4,
            "items": [
               OrderItem : {
                    "id": 7,
                    "item_name": "testing drive 6",
                    "status": "pending",
                    "order": 4
                } ,
                {
                    "id": 7,
                    "item_name": "testing drive 7",
                    "status": "pending",
                    "order": 4
                }
            ],
            "status": "pending",
            "user": 1,
            "company": 1
        }
 */
