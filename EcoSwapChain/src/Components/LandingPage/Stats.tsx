import Grid from '@mui/material/Grid2'
import { Box, Typography, Fade } from '@mui/material'
import BarChartIcon from '@mui/icons-material/BarChart'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import React, { useEffect } from 'react'

interface Stat {
  checked: boolean
  setChecked: (checked: boolean) => void
}

export const Stats: React.FC<Stat> = ({ checked, setChecked }) => {
  useEffect(() => {
    setChecked(true)
  }, [])

  return (
    <>
      <Box
        sx={{
          py: 10,
          backgroundColor: 'background.paper',
          boxShadow: 3
        }}
      >
        <Grid container spacing={4} sx={{ px: 4 }}>
          {[
            {
              icon: <BarChartIcon fontSize='large' />,
              title: 'Active Traders',
              value: '10K+'
            },
            {
              icon: <SwapHorizIcon fontSize='large' />,
              title: 'Daily Transactions',
              value: '50M+'
            },
            {
              icon: <PeopleAltIcon fontSize='large' />,
              title: 'Community Members',
              value: '100K+'
            }
          ].map((stat, index) => (
            <Grid size={4} key={index}>
              <Fade in={checked} timeout={800 + index * 200}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    borderRadius: 4,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <Box
                    sx={{
                      color: 'secondary.main',
                      mb: 2
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant='h3' sx={{ color: 'primary.main' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant='h6' sx={{ color: 'text.primary' }}>
                    {stat.title}
                  </Typography>
                </Box>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  )
}
