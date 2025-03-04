import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  Stack,
  TextField,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  InputAdornment,
  Grid,
  Fade,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  CloudUpload,
  Add,
  Delete,
  Info,
  PhotoLibrary,
} from '@mui/icons-material';
import MenuItem from '@mui/material/MenuItem';
import { PublicAPI } from '../../API/api';
import { API } from '../../API/api';
import NFTMintingModal from './NFTMintingModal';
import { useDispatch } from 'react-redux';
import { setAlertMessage, setAlertOn, setAlertSeverity } from '../../../Redux/alertBackdropSlice';



interface CategoryData {
  name: string;
  id: number;
}

interface ProductData {
  features: Record<string, string>;
  additionalImages: File[];
  material: string;
  condition: string;
  rootCategory: CategoryData,
  mainCategory: CategoryData,
}

// Types
interface NFTFormData {
  name: string;
  symbol: string;
  description: string;
  mainImage: File | null;
  price: string;
  exchange: boolean;
  product: ProductData
}


interface AddNew {
  addRoot: boolean;
  addMain: boolean
}

interface CategoryData {
  name: string,
  id: number
}

interface Categories {
  root: CategoryData[],
  main: CategoryData[]
}





// Styled Components
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ImagePreviewBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 200,
  borderRadius: theme.shape.borderRadius,
  border: `2px dashed ${theme.palette.primary.main}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.accent.main,
  },
}));

const AdditionalImagePreview = styled(Box)(({ theme }) => ({
  width: 100,
  height: 100,
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  overflow: 'hidden',
  '&:hover .delete-button': {
    opacity: 1,
  },
}));

const NFTCreationForm: React.FC = () => {

  const [formData, setFormData] = useState<NFTFormData>({
    name: '',
    symbol: '',
    description: '',
    mainImage: null,
    price: '',
    exchange: false,
    product: {
      features: {},
      additionalImages: [],
      material: '',
      condition: '',
      rootCategory: {
        name: "",
        id: 0
      },
      mainCategory: {
        name: "",
        id: 0
      }
    }
  });

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const [addNew, setAddNew] = useState<AddNew>({
    addRoot: false,
    addMain: false
  });

  const [categories, setCategories] = useState<Categories>({
    root: [],
    main: []
  })

  const [imageUrl, setImageUrl] = useState<string>("")


  async function getCat() {
    try {
      const response = await PublicAPI.get('product/cat/get/all');
      setCategories(response.data);
      console.log(response.data)
      console.log(categories)
    } catch (error) {
      console.log(error)

    }
  }

  useEffect(() => {
    getCat()
  }, [])

  const [errors, setErrors] = useState<{
    name?: string;
    symbol?: string;
    description?: string;
    mainImage?: string;
    price?: string;
    product?: {
      features?: string;
      additionalImages?: string;
      material?: string;
      condition?: string;
      rootCategory?: string;
      mainCategory?: string;
    };
  }>({});

  const featuresRef = useRef<HTMLInputElement>(null);

  const handleAddNewClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const type = (e.currentTarget.id); // Convert value to a number
    console.log(type)
    if (type === "root") {
      setAddNew((prev) => ({ ...prev, addRoot: !prev.addRoot })); // Toggle addRoot
    } else if (type === "main") {
      setAddNew((prev) => ({ ...prev, addMain: !prev.addMain })); // Toggle addMain
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "rootCategory") {
      setFormData((prev) => ({
        ...prev,
        product: {
          ...prev.product,
          rootCategory: {
            ...prev.product.rootCategory,
            [name]: value
          }
        }
      }));
    } else if (name === "mainCategory") {
      setFormData((prev) => ({
        ...prev,
        product: {
          ...prev.product,
          mainCategory: {
            ...prev.product.mainCategory,
            [name]: value
          }
        }
      }));
    } else if (name === "material") {
      setFormData((prev) => ({
        ...prev,
        product: {
          ...prev.product,
          [name]: value
        }
      }));
    } else if (name === "condition") {
      setFormData((prev) => ({
        ...prev,
        product: {
          ...prev.product,
          [name]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }))
    }
  }


  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, mainImage: e.target.files![0] }));
    }
  };

  const handleAdditionalImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        product: {
          ...prev.product,
          additionalImages: [
            ...prev.product.additionalImages, // Spread existing images
            ...newImages,                     // Add new images
          ],
        },
      }));
    }
  };

  const removeAdditionalImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      product: {
        ...prev.product,
        additionalImages: [
          ...prev.product.additionalImages.filter((_, i) => i !== index),                   // Add new images
        ],
      },
    }));
  };

  const addFeature = () => {
    if (featuresRef.current?.value) {
      const [key, value] = featuresRef.current.value.split(':');
      if (key && value) {
        setFormData((prev) => ({
          ...prev,
          product: {
            ...prev.product,
            features: {
              ...prev.product.features,
              [key.trim()]: value.trim(),
            },
          },
        }));
      }

      featuresRef.current.value = '';
    }
  }




  const handleNewCategoryChange = (event: React.ChangeEvent<HTMLInputElement>, categoryType: "rootCategory" | "mainCategory") => {
    setFormData((prev) => ({
      ...prev,
      product: {
        ...prev.product,
        [categoryType]: {
          ...prev.product[categoryType],
          name: event.target.value,
        }
      }
    }));
  };


  const validateForm = () => {
    const newErrors: Partial<{
      name: string;
      symbol: string;
      description: string;
      mainImage: string;
      price: string;
      product: {
        features?: string;
        additionalImages?: string;
        material?: string;
        condition?: string;
        rootCategory?: string;
        mainCategory?: string;
      };
    }> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.symbol.trim()) newErrors.symbol = "Symbol is required.";
    if (!formData.description.trim()) newErrors.description = "Description is required.";
    if (!formData.mainImage) newErrors.mainImage = "Main image is required.";
    if (!formData.price) newErrors.price = "Price is required.";
    if (isNaN(Number(formData.price))) newErrors.price = "Price must be a number.";

    // Ensure product exists before assigning nested properties
    newErrors.product = {};

    if (!formData.product.material.trim()) newErrors.product.material = "Material is required.";
    if (!formData.product.condition.trim()) newErrors.product.condition = "Condition is required.";
    if (!formData.product.rootCategory.name) newErrors.product.rootCategory = "Root category is required.";
    if (!formData.product.mainCategory.name) newErrors.product.mainCategory = "Main category is required.";
    if (Object.keys(formData.product.features).length === 0) newErrors.product.features = "At least one feature is required.";
    if (formData.product.additionalImages.length === 0) newErrors.product.additionalImages = "At least one additional image is required.";

    // Remove empty product object if no errors exist inside it
    if (Object.keys(newErrors.product).length === 0) delete newErrors.product;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const [nftId, setNftId] = useState<number>(0)

  const submitData = async (event: React.FormEvent<HTMLFormElement>) => {
    
    event.preventDefault()

    if (!validateForm()) {
      dispatch(setAlertOn(true))
      dispatch(setAlertSeverity("warning"))
      dispatch(setAlertMessage("Enter Valid Detals"))
      return
    }

    const sendData = new FormData();

    sendData.append("name", formData.name);
    sendData.append("symbol", formData.symbol);
    sendData.append("description", formData.description);
    sendData.append("price", formData.price);
    sendData.append("exchange", formData.exchange.toString());

    // Convert `product` into JSON format before appending
    sendData.append(
      "product",
      JSON.stringify({
        features: formData.product.features,
        material: formData.product.material,
        condition: formData.product.condition,
        rootCategory: formData.product.rootCategory,
        mainCategory: formData.product.mainCategory,
      })
    );

    if (formData.mainImage) {
      sendData.append("mainImage", formData.mainImage);
    }

    // Append additional images (files)
    formData.product.additionalImages.forEach((image, index) => {
      sendData.append(`product[additionalImages][${index}]`, image);
    });
    try {
      const response = await API.post('nfts/create/', sendData)
      console.log(response.data.NFT)
      setNftId(response.data.NFT.id)
      setImageUrl(response.data.NFT.mainImage)
      console.log(nftId)
      setOpen(true)
    } catch (error) {
      console.log(error)
    }
  };


  return (
    <>

      <NFTMintingModal
        open={open}
        onClose={() => setOpen(false)}
        nftData={{
          name: formData.name,
          imageUrl: imageUrl,
          swapCoinCost: Number(formData.price),
          createdAt: new Date().toISOString(),
          id: nftId
        }}
      />


      <Fade in timeout={800}>
        <form onSubmit={submitData}>
          <Card sx={{
            p: 4, maxWidth: 1200, mx: 'auto', mt: 10
          }}>
            <Typography variant="h4" gutterBottom fontWeight="600">
              Create New NFT
            </Typography>

            <Grid container spacing={3}>
              {/* Main Image Upload */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Main Image
                </Typography>
                <ImagePreviewBox>
                  {formData.mainImage ? (
                    <Box
                      component="img"
                      src={URL.createObjectURL(formData.mainImage)}
                      alt="Main preview"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Button
                      component="label"
                      variant="gradient"
                      startIcon={<CloudUpload />}
                    >
                      Upload Main Image
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageUpload}
                      />
                    </Button>
                  )}
                </ImagePreviewBox>
              </Grid>

              {/* Additional Images */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Additional Images
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  {formData.product.additionalImages.map((image, index) => (
                    <AdditionalImagePreview key={index}>
                      <Box
                        component="img"
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index}`}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <IconButton
                        className="delete-button"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          opacity: 0,
                          transition: 'opacity 0.2s',
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        }}
                        onClick={() => removeAdditionalImage(index)}
                      >
                        <Delete />
                      </IconButton>
                    </AdditionalImagePreview>
                  ))}
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<PhotoLibrary />}
                    sx={{ height: 100, width: 100 }}
                  >
                    Add
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImagesUpload}
                    />
                  </Button>
                </Stack>
              </Grid>

              {/* Basic Information */}

              <Grid item xs={12} md={6}>
                {/* Root Category Selection */}
                <>
                  {!addNew.addRoot && (
                    <TextField
                      select
                      fullWidth
                      label="Choose Root Category"
                      value={formData.product.rootCategory.name}
                      onChange={handleInputChange}
                      name="rootCategory"
                      error={!!errors.product?.rootCategory}
                      helperText={errors.product?.rootCategory}
                    >
                      <MenuItem value={formData.product.rootCategory.name}>
                        <em>{formData.product.rootCategory.name}</em>
                      </MenuItem>
                      {categories.root.map((r) => (
                        <MenuItem key={r.id} onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            product: {
                              ...prev.product,
                              rootCategory: {
                                ...prev.product.rootCategory,
                                name: r.name,
                                id: r.id
                              }
                            }
                          }))
                        }}>
                          {r.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
          
                </>
                <Button
                  type="button"
                  variant="gradient"
                  size="large"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleAddNewClick}
                  id="root"
                >
                  Add New Root
                </Button>
              </Grid>

              <Grid item xs={12} md={6}>
                {/* Main Category Selection */}
                {!addNew.addMain && (
                  <TextField
                    select
                    fullWidth
                    label="Choose Main Category"
                    value={formData.product.mainCategory.name}
                    onChange={handleInputChange}
                    name="mainCategory"
                    error={!!errors.product?.mainCategory}
                    helperText={errors.product?.mainCategory}
                  >
                    <MenuItem value={formData.product.mainCategory.name}>
                      <em>{formData.product.mainCategory.name}</em>
                    </MenuItem>
                    {categories.main.map((m) => (
                      <MenuItem key={m.id} onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          product: {
                            ...prev.product,
                            mainCategory: {
                              ...prev.product.mainCategory,
                              name: m.name,
                              id: m.id
                            }
                          }
                        }))
                      }}
                      
                      >
                        {m.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}

                <Button
                  type="button"
                  variant="gradient"
                  size="large"
                  id="main"
                  fullWidth
                  onClick={handleAddNewClick}
                  sx={{ mt: 2 }}
                >
                  Add New Main
                </Button>
              </Grid>

              {/* Add New Root Category Input */}
              {addNew.addRoot && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Add Root Category"
                    name="rootCategory"
                    value={formData.product.rootCategory.name}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleNewCategoryChange(event, "rootCategory")}
                    required
                    error={!!errors.product?.rootCategory}
                    helperText={errors.product?.rootCategory}
                  />
                </Grid>
              )}

              {/* Add New Main Category Input */}
              {addNew.addMain && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Add Main Category"
                    name="mainCategory"
                    value={formData.product.mainCategory.name}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleNewCategoryChange(event, "mainCategory")}
                    required
                    error={!!errors.product?.mainCategory}
                    helperText={errors.product?.mainCategory}
                  />
                </Grid>
              )}



              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={!!errors.name}
                  helperText={errors.name}

                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Symbol"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleInputChange}
                  error={!!errors.symbol}
                  helperText={errors.symbol}

                  inputProps={{ maxLength: 20 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  error={!!errors.price}
                  helperText={errors.price}

                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
              </Grid>




              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  error={!!errors.description}
                  helperText={errors.description}

                  multiline
                  rows={4}
                  inputProps={{ maxLength: 500 }}
                />
              </Grid>

              {/* Additional Fields */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Material"
                  name="material"
                  value={formData.product.material}
                  onChange={handleInputChange}
                  error={!!errors.product?.material}
                  helperText={errors.product?.material}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Condition"
                  name="condition"
                  value={formData.product.condition}
                  onChange={handleInputChange}
                  error={!!errors.product?.condition}
                  helperText={errors.product?.condition}
                />
              </Grid>

              {/* Features Section */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Features
                  <Tooltip title="Add features in key:value format">
                    <Info fontSize="small" sx={{ ml: 1 }} />
                  </Tooltip>
                </Typography>
                <Stack direction="row" spacing={2}>
                  <TextField
                    fullWidth
                    inputRef={featuresRef}
                    placeholder="e.g., Color: Blue"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={addFeature}>
                            <Add />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={!!errors.product?.features}
                    helperText={errors.product?.features}
                  />
                </Stack>
                <Box sx={{ mt: 2 }}>
                  {Object.entries(formData.product.features).map(([key, value]) => (
                    <Chip
                      key={key}
                      label={`${key}: ${value}`}
                      onDelete={() => {
                        setFormData((prev) => {
                          // eslint-disable-next-line @typescript-eslint/no-unused-vars
                          const { [key]: _, ...rest } = prev.product.features;
                          return { ...prev, product: { ...prev.product, features: rest } };
                        });
                      }}
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>

              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.exchange}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          exchange: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Available for Exchange"
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="gradient"
                  size="large"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Create NFT
                </Button>
              </Grid>
            </Grid>
          </Card>
        </form>
      </Fade>
    </>
  );
};

export default NFTCreationForm;