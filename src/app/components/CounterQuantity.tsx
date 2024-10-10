import { useState } from "react";

type Props = {
  quantityUser: number;
};

const CounterQuantity = ({ quantityUser }: Props) => {
  const customButton: string =
    "text-2xl bg-gray-200 text-gray-400 font-bold w-12 mx-auto py-2 ";
  const [quantity, setQuantity] = useState<number>(quantityUser);

  const addQuantity = (): void => {
    if (quantity < quantityUser + 1) {
      setQuantity(quantity + 1);
    }
  };

  const lessQuantity = (): void => {
    if (quantity > quantityUser) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="flex mr-4 flex-col text-center ">
      <button
        className={customButton}
        onClick={addQuantity}
        data-testid="my-button"
      >
        +
      </button>
      <p className="bg-gray-200 w-12 h-22 text-2xl mx-auto text-center flex items-center justify-center text-blue-800 font-bold">
        {quantity}
      </p>
      <button className={customButton} onClick={lessQuantity}>
        -
      </button>
    </div>
  );
};

export default CounterQuantity;
