import React, { useState } from "react";
import Input from "../Inputs/Input";

const AddSubscriptionForm = ({ onAdd }) => {
  const [f, setF] = useState({ name:'', amount:'', startDate:'', nextBillingDate:'' });
  const change=(k,v)=>setF(s=>({ ...s,[k]:v }));

  return (
    <div>
      <Input label="Name" placeholder="Netflix" type="text" value={f.name} onChange={e=>change('name',e.target.value)} />
      <Input label="Amount" type="number" value={f.amount} onChange={e=>change('amount',e.target.value)} />
      <Input label="Start Date" type="date" value={f.startDate} onChange={e=>change('startDate',e.target.value)} />
      <Input label="Next Billing Date" type="date" value={f.nextBillingDate} onChange={e=>change('nextBillingDate',e.target.value)} />
      <div className="flex justify-end mt-6">
        <button className="add-btn add-btn-fill" onClick={()=>onAdd({
            name:f.name, amount:Number(f.amount), startDate:f.startDate, nextBillingDate:f.nextBillingDate })}>
          Add Subscription
        </button>
      </div>
    </div>
  );
};

export default AddSubscriptionForm;