import { Paper, Typography, useMediaQuery } from '@mui/material'
import { Stack } from '@mui/system';
import React from 'react'
import mail_sentBG from "../../assets/mail_sent.svg"

export default function VerifyEmail({email}) {

  const small = useMediaQuery("(max-width:500px)");

  return (
    <Paper variant="elevation"
    elevation={3}
    sx={{ p: small ? 2 : 4, width: small ? "100%" : null }}>
        <Stack alignItems={"center"} justifyContent={"center"}>
        <img
              src={mail_sentBG}
              alt=""
              height={250}
              style={{ objectFit: "contain" }}
            />
            <Typography my={2} textAlign="center">An Email has been sent to your email address - {email}. Check it to confirm your email address and proceed to booking your appointment.</Typography>
        </Stack>
    </Paper>
  )
}
