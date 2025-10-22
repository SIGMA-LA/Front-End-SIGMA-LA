'use client'

import { useRouter } from 'next/navigation'
import PedidosList from '@/components/coordinacion/PedidosList'
import { Obra } from '@/types'

export default function PedidosPage() {
  const router = useRouter()

  return (
    <PedidosList
      onSchedulePedido={(obra: Obra) => {
        router.push(`/coordinacion/pedidos/crear?obra=${obra.cod_obra}`)
      }}
    />
  )
}
