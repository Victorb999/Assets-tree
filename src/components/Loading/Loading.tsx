type LoadingProps = {
  msg?: string
}
export const Loading = ({ msg }: LoadingProps) => {
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <h1> Aguarde, carregando ...</h1>
      <span>{msg}</span>
    </div>
  )
}
