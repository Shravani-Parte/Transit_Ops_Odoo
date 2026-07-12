import React, { useState } from "react";
import Input from "@/common/components/Input";
import Button from "@/common/components/Button";

export default function TripCompletionForm({ trip, onSubmit, onCancel }) {
  const [actual, setActual] = useState(trip.planned_distance);
  const [rev, setRev] = useState(trip.revenue);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ actual_distance: Number(actual), revenue: Number(rev) }); }} className="space-y-3">
      <Input label="Actual Distance (km) *" type="number" value={actual} onChange={(e) => setActual(e.target.value)} />
      <Input label="Revenue (INR)" type="number" value={rev} onChange={(e) => setRev(e.target.value)} />
      <div className="flex justify-end gap-2">
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
        <Button type="submit">Complete Trip</Button>
      </div>
    </form>
  );
}
