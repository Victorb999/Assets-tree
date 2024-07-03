import Image from 'next/image'
import LoadingAnimated from '@/assets/img/loading.svg'
type LoadingProps = {
  msg?: string
}
export const Loading = ({ msg }: LoadingProps) => {
  return (
    <div className="flex flex-col w-full items-center justify-center gap-2">
      <h1> Aguarde, carregando ...</h1>
      <Image alt="loading" height={200} src={LoadingAnimated} width={200} />
      <span>{msg}</span>
    </div>
  )
}
