import { useEffect, type SetStateAction } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useStore } from "../../store";

import { type ProductProps } from "../../types";

interface ModalProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}

const Modal: React.FC<ModalProps> = ({ open, setOpen }) => {
  // hooks
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProductProps>({});
  const { addProduct, products, editProduct, product, updateProduct } =
    useStore();

  // useEffect
  useEffect(() => {
    setValue("title", product?.title || "");
    setValue("price", product?.price || 0);
    setValue("img", product?.img || "");
    setValue("rate", product?.rate || 0);
    setValue("description", product?.description || "");
  }, [product, setValue]);

  // handle
  const handleModal = () => {
    editProduct(null);
    setOpen((prev) => !prev);
  };
  const onSubmit: SubmitHandler<ProductProps> = (data) => {
    if (product) {
      updateProduct({
        id: product.id,
        title: data.title,
        img: data.img,
        description: data.description,
        price: data.price,
        rate: data.rate,
      });
    } else {
      addProduct({
        id: products.length + 1,
        title: data.title,
        img: data.img,
        description: data.description,
        price: data.price,
        rate: data.rate,
      });
    }

    reset();
    setOpen(false);
    editProduct(null);
  };

  return open ? (
    <div className="absolute w-screen h-screen bg-zinc-700/50 top-0 left-0">
      <div className="fixed flex flex-col gap-5 bg-white top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 max-w-md w-full p-5 shadow-md rounded-lg">
        <div className="flex flex-row justify-between items-center">
          <h1 className="font-bold">Tambah Produk</h1>

          <button className="cursor-pointer" onClick={handleModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          className="flex flex-col space-y-5"
          onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <input
              {...register("title", {
                required: true,
              })}
              placeholder="Masukan Judul"
              name="title"
              className={`p-2 border-b outline-0 ${
                errors.title ? "border-red-800" : " border-zinc-800"
              }`}
            />
            {errors.title && (
              <span className="text-red-600 text-sm">Judul Harus diisi</span>
            )}
          </div>

          <div className="flex flex-col">
            <input
              {...register("price", {
                required: true,
                valueAsNumber: true,
                validate: (value) => value > 0,
              })}
              placeholder="Masukan Harga"
              name="price"
              type="number"
              className={`p-2 border-b outline-0 ${
                errors.price ? "border-red-800" : " border-zinc-800"
              }`}
            />
            {errors.price && (
              <span className="text-red-600 text-sm">Harga Harus diisi</span>
            )}
          </div>

          <div className="flex flex-col">
            <input
              {...register("img", {
                required: true,
              })}
              placeholder="Masukan URL gambar"
              name="img"
              type="url"
              className={`p-2 border-b outline-0 ${
                errors.img ? "border-red-800" : " border-zinc-800"
              }`}
            />
            {errors.img && (
              <span className="text-red-600 text-sm">
                URL gambar Harus diisi
              </span>
            )}
          </div>

          <div>
            <label htmlFor="Rating">
              <select
                {...register("rate", {
                  valueAsNumber: true,
                  required: true,
                  validate: (value) => Number(value) > 0 && Number(value) <= 5,
                })}
                id="Rating"
                className={`mt-0.5 py-2 w-full sm:text-sm ${
                  errors.rate ? "outline-red-500" : "outline-transparent"
                }`}>
                <option value="0">Rating produk</option>
                {[1, 2, 3, 4, 5].map((item) =>
                  product ? (
                    <option
                      key={item}
                      value={item}
                      selected={product.rate === item}>
                      {item}
                    </option>
                  ) : (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  )
                )}
              </select>
            </label>
            {errors.rate && (
              <span className="text-red-600 text-sm">Nilai Harus diisi</span>
            )}
          </div>

          <div className="flex flex-col">
            <textarea
              {...register("description", {
                required: true,
              })}
              placeholder="Deskripsi singkat produk"
              name="description"
              className={`p-2 border-b outline-0 ${
                errors.description ? "border-red-800" : " border-zinc-800"
              }`}
            />
            {errors.description && (
              <span className="text-red-600 text-sm">
                Deskripsi Harus diisi
              </span>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="bg-zinc-800 text-white px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-zinc-700">
              Tambah produk
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default Modal;
