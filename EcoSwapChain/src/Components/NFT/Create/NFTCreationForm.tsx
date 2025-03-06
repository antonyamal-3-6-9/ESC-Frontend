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
  Checkbox
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
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import CertificationModal from './AddCertification';


const materialsList = [
  "wood", "metal", "plastic", "glass", "paper", "fabric", "ceramic", "rubber", "leather", "stone",
  "bamboo", "cotton", "silk", "wool", "linen", "hemp", "jute", "coir", "sisal", "cork"
];



interface CategoryData {
  name: string;
  id: number;
}

interface Certification {
  name: string;
  description: string;
  certificationNumber: string;
}


interface ProductData {
  features: Record<string, string>;
  certifications: Certification[];
  additionalMaterials: string[];
  additionalImages: File[];
  condition: string;
  rootCategory: CategoryData;
  mainCategory: CategoryData;
  recycledContent: number | null;
  recyclability: boolean;
  carbonFootprint: number | null;
  energyEfficiency: number | null;
  durability: number | null;
  repairabilityScore: number | null;
  ethicalSourcing: boolean;
  crueltyFree: boolean;
  plasticFree: boolean;
  natural: boolean;
  destructable: boolean;
  hazardous: boolean;
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
      certifications: [],
      additionalMaterials: [],
      additionalImages: [],
      condition: '',
      rootCategory: {
        name: "",
        id: 0
      },
      mainCategory: {
        name: "",
        id: 0
      },
      recycledContent: null,
      recyclability: false,
      carbonFootprint: null,
      energyEfficiency: null,
      durability: null,
      repairabilityScore: null,
      ethicalSourcing: false,
      crueltyFree: false,
      plasticFree: false,
      natural: false,
      destructable: false,
      hazardous: false
    }
  });

  

  const dispatch = useDispatch();


    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

    const handleMaterialChange = (event: React.ChangeEvent<HTMLInputElement>, newMaterials: string[]) => {
      setSelectedMaterials(newMaterials);
    };
  
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

  const handleNumericChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      product: {
        ...prev.product,
        [name]: value === "" ? null : parseFloat(value)
      }
    }));
  };

  const handleBooleanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      product: {
        ...prev.product,
        [name]: checked
      }
    }));
  };


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

  const materialsRef = useRef<HTMLInputElement>(null);

  const addMaterial = () => {
    if (materialsRef.current?.value) {
      setFormData((prev) => ({
        ...prev,
        product: {
          ...prev.product,
          additionalMaterials: [...(prev.product.additionalMaterials || []), materialsRef.current ? materialsRef.current.value.trim() : ''],
        },
      }));

      materialsRef.current.value = '';
    }
    console.log(formData)
  };

  const [showModal, setShowModal] = useState<boolean>(false);
  const certificationsQueue = useRef<Certification[]>([]); // Queue to track multiple certifications

  const addCertification = () => {
    setShowModal(true);
  };


  const handleSaveCertification = (certification: Certification) => {
    setFormData((prev) => ({
      ...prev,
      product: {
        ...prev.product,
        certifications: [...prev.product.certifications, certification],
      },
    
    }));
    console.log(formData)
    // If multiple certifications are queued, trigger modal again
    if (certificationsQueue.current.length > 0) {
      certificationsQueue.current.shift(); // Remove processed entry
      setShowModal(true);
    } else {
      setShowModal(false); // Close modal
    }
  };




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
      product: Partial<{
        features: string;
        certifications: string;
        additionalMaterials: string;
        additionalImages: string;
        condition: string;
        rootCategory: string;
        mainCategory: string;
        recycledContent: string;
        carbonFootprint: string;
        energyEfficiency: string;
        durability: string;
        repairabilityScore: string;
        ethicalSourcing: string;
        crueltyFree: string;
        plasticFree: string;
        natural: string;
        destructable: string;
        hazardous: string;
      }>;
    }> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Name must be less than 50 characters.";
    }

    // Symbol validation
    if (!formData.symbol.trim()) {
      newErrors.symbol = "Symbol is required.";
    } else if (formData.symbol.trim().length < 2 || formData.symbol.trim().length > 5) {
      newErrors.symbol = "Symbol must be between 2-5 characters.";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    }

    // Main image validation
    if (!formData.mainImage) {
      newErrors.mainImage = "Main image is required.";
    } else if (formData.mainImage.size > 5 * 1024 * 1024) {
      newErrors.mainImage = "Image size must be less than 5MB.";
    } else if (!['image/jpeg', 'image/png'].includes(formData.mainImage.type)) {
      newErrors.mainImage = "Only JPEG and PNG formats are allowed.";
    }

    // Price validation
    if (!formData.price) {
      newErrors.price = "Price is required.";
    } else if (isNaN(Number(formData.price))) {
      newErrors.price = "Price must be a number.";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }

    // Initialize product errors object
    newErrors.product = {};

    // Product validations
    // Condition
    if (!formData.product.condition.trim()) {
      newErrors.product.condition = "Condition is required.";
    }

    // Categories
    if (formData.product.rootCategory.name.length === 0) {
      newErrors.product.rootCategory = "Root category is required.";
    }
    if (formData.product.mainCategory.name.length === 0) {
      newErrors.product.mainCategory = "Main category is required.";
    }

    // Features
    if (Object.keys(formData.product.features).length === 0) {
      newErrors.product.features = "At least one feature is required.";
    }

    // Certifications
    if (formData.product.certifications.length === 0) {
      newErrors.product.certifications = "At least one certification is required.";
    }

    // Additional Materials
    if (formData.product.additionalMaterials.length === 0) {
      newErrors.product.additionalMaterials = "At least one material is required.";
    }

    // Additional Images
    if (formData.product.additionalImages.length === 0) {
      newErrors.product.additionalImages = "At least one additional image is required.";
    }

    // Recycled Content
    if (formData.product.recycledContent === null || formData.product.recycledContent === undefined) {
      newErrors.product.recycledContent = "Recycled content is required.";
    } else if (formData.product.recycledContent < 0 || formData.product.recycledContent > 100) {
      newErrors.product.recycledContent = "Recycled content must be between 0-100%.";
    }

    // Carbon Footprint
    if (formData.product.carbonFootprint === null || formData.product.carbonFootprint === undefined) {
      newErrors.product.carbonFootprint = "Carbon footprint is required.";
    } else if (formData.product.carbonFootprint < 0) {
      newErrors.product.carbonFootprint = "Carbon footprint must be a positive number.";
    }

    // Energy Efficiency
    if (formData.product.energyEfficiency === null || formData.product.energyEfficiency === undefined) {
      newErrors.product.energyEfficiency = "Energy efficiency is required.";
    } else if (formData.product.energyEfficiency < 0 || formData.product.energyEfficiency > 100) {
      newErrors.product.energyEfficiency = "Energy efficiency must be between 0-100%.";
    }

    // Durability
    if (formData.product.durability === null || formData.product.durability === undefined) {
      newErrors.product.durability = "Durability score is required.";
    } else if (formData.product.durability < 1 || formData.product.durability > 10) {
      newErrors.product.durability = "Durability must be between 1-10.";
    }

    // Repairability Score
    if (formData.product.repairabilityScore === null || formData.product.repairabilityScore === undefined) {
      newErrors.product.repairabilityScore = "Repairability score is required.";
    } else if (formData.product.repairabilityScore < 1 || formData.product.repairabilityScore > 10) {
      newErrors.product.repairabilityScore = "Repairability must be between 1-10.";
    }

    // Sustainability Flags
    if (!formData.product.ethicalSourcing) newErrors.product.ethicalSourcing = "Ethical sourcing is required.";
    if (!formData.product.crueltyFree) newErrors.product.crueltyFree = "Cruelty-free certification is required.";
    if (!formData.product.plasticFree) newErrors.product.plasticFree = "Plastic-free status is required.";

    // Cleanup empty product errors
    if (Object.keys(newErrors.product).length === 0) {
      delete newErrors.product;
    }

    console.log(newErrors)

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [nftId, setNftId] = useState<number>(0)
  const submitData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      dispatch(setAlertOn(true));
      dispatch(setAlertSeverity("warning"));
      dispatch(setAlertMessage("Please correct the highlighted errors before submitting"));
      return;
    }

    const sendData = new FormData();

    try {
      // Append basic fields
      sendData.append("name", formData.name.trim());
      sendData.append("symbol", formData.symbol.trim().toUpperCase());
      sendData.append("description", formData.description.trim());
      sendData.append("price", Number(formData.price).toFixed(2));
      sendData.append("exchange", formData.exchange.toString());

      // Construct full product JSON with numerical validation
      const productData = {
        features: formData.product.features,
        certifications: formData.product.certifications,
        materialsUsed: selectedMaterials,
        additionalMaterials: formData.product.additionalMaterials,
        condition: formData.product.condition,
        rootCategory: formData.product.rootCategory,
        mainCategory: formData.product.mainCategory,
        recycledContent: Number(formData.product.recycledContent),
        recyclability: formData.product.recyclability,
        carbonFootprint: Number(formData.product.carbonFootprint),
        energyEfficiency: Number(formData.product.energyEfficiency),
        durability: Number(formData.product.durability),
        repairabilityScore: Number(formData.product.repairabilityScore),
        ethicalSourcing: formData.product.ethicalSourcing,
        crueltyFree: formData.product.crueltyFree,
        plasticFree: formData.product.plasticFree,
        natural: formData.product.natural,
        destructable: formData.product.destructable,
        hazardous: formData.product.hazardous
      };

      // Stringify product data with numeric conversion
      sendData.append("product", JSON.stringify(productData));

      // Handle main image with type checking
      if (formData.mainImage) {
        if (!(formData.mainImage instanceof File)) {
          throw new Error("Invalid main image file format");
        }
        sendData.append("mainImage", formData.mainImage);
      }

      // Handle additional images with index tracking
      formData.product.additionalImages.forEach((image, index) => {
        if (!(image instanceof File)) {
          throw new Error(`Invalid file format for additional image #${index + 1}`);
        }
        sendData.append(`product[additionalImages][${index}]`, image);
      });

      // API call with loading state
  
      const response = await API.post('nfts/create/', sendData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });

      if (response.data.NFT) {
        setNftId(response.data.NFT.id);
        setImageUrl(response.data.NFT.mainImage);
        dispatch(setAlertOn(true));
        dispatch(setAlertSeverity("success"));
        dispatch(setAlertMessage("NFT created successfully!"));
        setOpen(true);
      }

      console.log(formData)
      console.log(sendData)

    } catch (error) {
      console.error("Submission error:", error);
      dispatch(setAlertOn(true));
      dispatch(setAlertSeverity("error"));
      dispatch(setAlertMessage("An error occurred during submission"));
    } finally {
      console.log("done")
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

      

      <CertificationModal open={showModal} onClose={() => setShowModal(false)} onSave={handleSaveCertification} />


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



              <Grid item xs={12} md={4}>
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

              <Grid item xs={12} md={4}>
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

              <Grid item xs={12} md={4}>
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

              <Grid item xs={12} md={4}>
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
  
                {/* Numeric Fields */}
                {[
                  { label: "Recycled Content (%)", name: "recycledContent", type: "number" },
                  { label: "Carbon Footprint (kg CO2e)", name: "carbonFootprint", type: "number" },
                  { label: "Energy Efficiency (kWh/year)", name: "energyEfficiency", type: "number" },
                  { label: "Durability (years)", name: "durability", type: "number" },
                  { label: "Repairability Score (0-10)", name: "repairabilityScore", type: "number" }
                ].map((field) => (
                  <Grid item xs={12} md={4} key={field.name}>
                    <TextField
                      fullWidth
                      label={field.label}
                      name={field.name}
                      type={field.type}
                      value={formData.product[field.name as keyof ProductData] || ""}
                      onChange={handleNumericChange}
                    />
                  </Grid>
                ))}

                {/* Boolean Fields */}
                {[
                  { label: "Is the product recyclable?", name: "recyclability" },
                  { label: "Are materials ethically sourced?", name: "ethicalSourcing" },
                  { label: "Is the product cruelty-free?", name: "crueltyFree" },
                  { label: "Is the product plastic-free?", name: "plasticFree" },
                  { label: "Is the product made from natural materials?", name: "natural" },
                  { label: "Is the product destructible?", name: "destructable" },
                  { label: "Is the product hazardous?", name: "hazardous" }
                ].map((field) => (
                  <Grid item xs={12} md={4} key={field.name}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={Boolean(formData.product[field.name as keyof ProductData])}
                          onChange={handleBooleanChange}
                          name={field.name}
                        />
                      }
                      label={field.label}
                    />
                  </Grid>
                ))}
            


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
                  rows={2}
                  inputProps={{ maxLength: 500 }}
                />
              </Grid>

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

              <Grid item xs={12}>
                <ToggleButtonGroup
                  value={selectedMaterials}
                  onChange={handleMaterialChange}
                  aria-label="material selection"
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'repeat(2, 1fr)',    // 2 columns on mobile
                      sm: 'repeat(3, 1fr)',    // 3 columns on tablet
                      md: 'repeat(10, 1fr)'     // 5 columns on desktop
                    },
                    gap: 0,
                    width: '100%'
                  }}
                >
                  {materialsList.map((material) => (
                    <ToggleButton
                      key={material}
                      value={material}
                      
                      sx={{
                        m: 0.5,
                        flex: 1,
                        textTransform: 'capitalize',
                        borderRadius: 0,
                        border: 0,
                        '&.Mui-selected': {
                          backgroundColor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                            color: 'white',
                          }
                        }
                      }}
                    >
                      {material.charAt(0).toUpperCase() + material.slice(1)}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
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
                <Typography variant="subtitle1" gutterBottom>
                  Additional Materials Used
                  <Tooltip title="Add features in key:value format">
                    <Info fontSize="small" sx={{ ml: 1 }} />
                  </Tooltip>
                </Typography>
                <Stack direction="row" spacing={2}>
                  <TextField
                    fullWidth
                    inputRef={materialsRef}
                    placeholder="e.g., Color: Blue"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={addMaterial}>
                            <Add />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
     
                  />
                </Stack>
                <Box sx={{ mt: 2 }}>
                  {formData.product.additionalMaterials?.map((material, index) => (
                    <Chip
                      key={index}
                      label={material}
                      onDelete={() => {
                        setFormData((prev) => ({
                          ...prev,
                          product: {
                            ...prev.product,
                            additionalMaterials: prev.product.additionalMaterials.filter((_, i) => i !== index),
                          },
                        }));
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
                <Button onClick={addCertification} variant="contained">Add Certification</Button>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  {formData.product.certifications?.map((certificate, index) => (
                    <Chip
                      key={index}
                      label={certificate.name}
                      onDelete={() => {
                        setFormData((prev) => ({
                          ...prev,
                          product: {
                            ...prev.product,
                            certifications: prev.product.certifications.filter((_, i) => i !== index),
                          },
                        }));
                      }}
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>

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