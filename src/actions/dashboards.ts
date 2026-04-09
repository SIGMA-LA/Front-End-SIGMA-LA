'use server'

import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { getAccessToken } from './auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

export async function getAdminDashboardStats() {
  try {
    const token = await getAccessToken()

    const [pagosRes, obrasRes] = await Promise.all([
      fetchWithErrorHandling(`${API_URL}/pagos/stats/facturacion`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 30, tags: ['dashboard-admin'] },
      }),
      fetchWithErrorHandling(`${API_URL}/obras/stats/admin`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 30, tags: ['dashboard-admin'] },
      }),
    ])

    const pagosStats = await pagosRes.json()
    const obrasStats = await obrasRes.json()

    return {
      ingresosMes: pagosStats.ingresosMes || 0,
      ingresosMesPasado: pagosStats.ingresosMesPasado || 0,
      porcentajeCrecimiento: pagosStats.porcentajeCrecimiento || 0,
      cuentasPorCobrar: obrasStats.cuentasPorCobrar || 0,
      obrasActivas: obrasStats.obrasActivas || 0,
      nuevasObrasDelMes: obrasStats.nuevasObrasDelMes || 0,
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('[getAdminDashboardStats]', error.message)
    } else {
      console.error('[getAdminDashboardStats]', error)
    }
    return {
      ingresosMes: 0,
      ingresosMesPasado: 0,
      porcentajeCrecimiento: 0,
      cuentasPorCobrar: 0,
      obrasActivas: 0,
      nuevasObrasDelMes: 0,
    }
  }
}

export async function getCoordinacionDashboardStats() {
  try {
    const token = await getAccessToken()

    const [visitasRes, entregasRes, obrasRes] = await Promise.all([
      fetchWithErrorHandling(`${API_URL}/visitas/stats/progreso-diario`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 30, tags: ['dashboard-coordinacion'] },
      }),
      fetchWithErrorHandling(`${API_URL}/entregas/stats/progreso-diario`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 30, tags: ['dashboard-coordinacion'] },
      }),
      fetchWithErrorHandling(`${API_URL}/obras/stats/coordinacion`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 30, tags: ['dashboard-coordinacion'] },
      }),
    ])

    const visitasStats = await visitasRes.json()
    const entregasStats = await entregasRes.json()
    const obrasStats = await obrasRes.json()

    const agendaHoyVisitas = visitasStats.agendaHoyVisitas || 0
    const completadosHoyVisitas = visitasStats.completadosHoyVisitas || 0
    const agendaHoyEntregas = entregasStats.agendaHoyEntregas || 0
    const completadosHoyEntregas = entregasStats.completadosHoyEntregas || 0

    return {
      agendaHoyVisitas,
      agendaHoyEntregas,
      agendaTotalHoy: agendaHoyVisitas + agendaHoyEntregas,
      completadosHoyVisitas,
      completadosHoyEntregas,
      completadosTotalHoy: completadosHoyVisitas + completadosHoyEntregas,
      listasParaEntregar: obrasStats.listasParaEntregar || 0,
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('[getCoordinacionDashboardStats]', error.message)
    } else {
      console.error('[getCoordinacionDashboardStats]', error)
    }
    return {
      agendaHoyVisitas: 0,
      agendaHoyEntregas: 0,
      agendaTotalHoy: 0,
      completadosHoyVisitas: 0,
      completadosHoyEntregas: 0,
      completadosTotalHoy: 0,
      listasParaEntregar: 0,
    }
  }
}

export async function getVentasDashboardStats() {
  try {
    const token = await getAccessToken()

    const obrasRes = await fetchWithErrorHandling(`${API_URL}/obras/stats/ventas`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 30, tags: ['dashboard-ventas'] },
    })

    const obrasStats = await obrasRes.json()

    return {
      totalPorCobrar: obrasStats.totalPorCobrar || 0,
      obrasGanadasMes: obrasStats.obrasGanadasMes || 0,
      obrasFaltaStock: obrasStats.obrasFaltaStock || 0,
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('[getVentasDashboardStats]', error.message)
    } else {
      console.error('[getVentasDashboardStats]', error)
    }
    return {
      totalPorCobrar: 0,
      obrasGanadasMes: 0,
      obrasFaltaStock: 0,
    }
  }
}
