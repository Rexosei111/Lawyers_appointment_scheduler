import { Typography } from '@mui/material'
import { Container } from '@mui/system'
import React from 'react'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <Container maxWidth="xl">
        <Typography variant="h4">Homepage</Typography>
        <Outlet />
    </Container>
  )
}
