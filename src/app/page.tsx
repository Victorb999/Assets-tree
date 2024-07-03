import Image from 'next/image'
import Tree from '@/assets/img/tree.svg'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center w-full p-4 gap-4">
      <h1 className="text-3xl font-bold mb-2">
        Bem vindo, ao controle de assets!
      </h1>
      <span>
        Selecione uma empresa no menu para visualizar as localizações e os
        ativos
      </span>
      <Image alt="loading" height={400} src={Tree} width={400} />
    </main>
  )
}
