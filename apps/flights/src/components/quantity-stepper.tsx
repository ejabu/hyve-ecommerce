interface Props {
  qty: number;
  onChange: (qty: number) => void;
  label: string;
}

export function QuantityStepper({ qty, onChange, label }: Props) {
  if (qty === 0) {
    return (
      <button className="btn btn-sm" onClick={() => onChange(1)} aria-label={`Add ${label}`}>
        Add
      </button>
    );
  }
  return (
    <div className="stepper">
      <button onClick={() => onChange(qty - 1)} aria-label={`Remove one ${label}`}>
        −
      </button>
      <span>{qty}</span>
      <button onClick={() => onChange(qty + 1)} aria-label={`Add one ${label}`}>
        +
      </button>
    </div>
  );
}
