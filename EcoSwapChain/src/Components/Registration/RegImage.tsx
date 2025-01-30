import { Box } from "@mui/material"
import RImg from "./RImg.jpg"

const RegImage = () => {
    return (
        <Box
            sx={{
              height: "80vh",
              backgroundImage: `url("${RImg}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              padding: "0 20px",
              boxShadow: "10",
            }}
          />
    )
}

export default RegImage