import { useEffect, useState } from "react";
import axios from "axios";

import { useStore } from "./store";

import Modal from "./components/Modal";
import { type ProductProps, type BattleEffect, type Pokemon } from "./types";

const App: React.FC = () => {
  // state
  const [open, setOpen] = useState<boolean>(false); // <- state modal tambah
  const [data, setData] = useState<ProductProps[]>([]);
  const [pokemon, setPokemon] = useState<Pokemon[] | null>(null); // pokemon
  const [battle, setBattle] = useState<BattleEffect | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // hooks
  const { products, product, removeProduct, editProduct } = useStore();

  // useEffect
  useEffect(() => {
    if (product) {
      setOpen(true);
    }
  }, [product]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const {
          data: dataPokemon,
        }: {
          data: {
            count: number;
            next: string;
            previous: string | null;
            results: Pokemon[];
          };
        } = await axios.get("https://pokeapi.co/api/v2/pokemon/");
        const {
          data: dataBattleEffect,
        }: {
          data: BattleEffect;
        } = await axios.get("https://pokeapi.co/api/v2/ability/battle-armor");

        setPokemon(dataPokemon.results);
        setBattle(dataBattleEffect);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetch();

    return () => {
      setPokemon([] as Pokemon[]);
      setLoading(true);
    };
  }, []);

  useEffect(() => {
    setData(products);
  }, [products]);

  // handle
  const handleModal = () => {
    editProduct(null);
    setOpen((prev) => !prev);
  };
  const handleDelete = (index: number) => {
    if (confirm("Hapus produk ini ?")) {
      removeProduct(index);
    }
  };
  const handleSelectedProduct = (item: number) => {
    editProduct(item);
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(
      products.filter((p) => p.title.toLowerCase().includes(e.target.value))
    );
  };

  return (
    <div className="font-display relative">
      <nav className="p-5 shadow">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-semibold">Hello World</h1>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto py-5 flex flex-col gap-4 p-5 lg:p-0">
        <div className="flex justify-between items-center">
          <h1>Techical Test</h1>

          <button
            onClick={handleModal}
            className="bg-zinc-800 text-white px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-zinc-700">
            Tambah Produk
          </button>
        </div>

        <div className="flex flex-row justify-between items-center gap-5">
          <input
            placeholder="Cari"
            onChange={(e) => handleSearch(e)}
            className="flex-1 border-1 border-zinc-500 px-3 py-2"
          />
          <select>
            <option value="0">Urutan produk</option>
            <option value="0">Urutan stok</option>
            <option value="0">Urutan harga</option>
          </select>
        </div>

        <div className="min-h-screen">
          {data.length === 0 ? (
            <div className="text-center mt-5 font-bold">
              <h1>Silahkan tambah produk terlebih dahulu</h1>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 p-5 lg:p-0 ">
              {data.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col py-5 group hover:cursor-pointer relative">
                  <div className="relative">
                    <span className="bg-red-500 text-white px-3 py-1 absolute text-sm left-3 top-3">
                      Homecraft
                    </span>

                    <div className="absolute right-3 top-3 flex space-x-2">
                      <button
                        onClick={() => {
                          handleSelectedProduct(item.id);
                        }}
                        className="bg-white p-2 shadow-sm rounded-sm cursor-pointer"
                        title="edit produk">
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
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                          />
                        </svg>
                      </button>
                      <button
                        className="bg-white p-2 shadow-sm rounded-sm cursor-pointer"
                        title="hapus produk"
                        onClick={() => handleDelete(item.id)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6 text-red-500">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>

                    <img className="aspect-square bg-cover" src={item.img} />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <h1 className="text-center font-semibold group-hover:underline text-lg">
                      {item.title}
                    </h1>

                    <div className="flex gap-4 mt-2 font-bold text-lg justify-center">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(item.price)}
                    </div>
                    <span className="mb-5 text-center flex gap-1 justify-center">
                      {Array.from({ length: item.rate }).map((_, index) => (
                        <div key={index}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-5">
                            <path
                              fillRule="evenodd"
                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      ))}
                      {Array.from({ length: 5 - item.rate }).map((_, index) => (
                        <div key={index}>
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
                              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                            />
                          </svg>
                        </div>
                      ))}
                    </span>
                    <p className="text-center text-sm text-zinc-600 group-hover:text-transparent transition-all">
                      {item.description.slice(0, 55)}
                    </p>
                    <button className="bg-white cursor-pointer transition-all hidden group-hover:block group-hover:underline text-sm px-3 py-1.5 absolute font-bold text-red-600 uppercase bottom-5 left-1/2 -translate-x-1/2">
                      add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <h1>Loading</h1>
        ) : (
          <>
            <h1 className="font-bold my-3">Daftar Pokemon</h1>
            <div className="table">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y-2 divide-gray-200">
                  <thead className="ltr:text-left rtl:text-right">
                    <tr className="*:font-medium *:text-gray-900">
                      <th className="px-3 py-2 whitespace-nowrap">Name</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {pokemon?.map((item, index) => (
                      <tr
                        key={index}
                        className="*:text-gray-900 *:first:font-medium">
                        <td className="px-3 py-2 whitespace-nowrap">
                          {item.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="min-h-screen my-2">
              <h1 className="font-bold mb-4">Efek Battle Armor</h1>
              {battle?.effect_entries.map((item, index) => (
                <p key={index}>{item.effect}</p>
              ))}
            </div>
          </>
        )}
      </div>
      <Modal open={open} setOpen={setOpen} />
    </div>
  );
};

export default App;
