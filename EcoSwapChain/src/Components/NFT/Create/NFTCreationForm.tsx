import React, { useState, useRef } from 'react';
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
  Alert,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  CloudUpload,
  Add,
  Delete,
  Info,
  PhotoLibrary,
} from '@mui/icons-material';

// Types
interface NFTFormData {
  address: string;
  name: string;
  symbol: string;
  description: string;
  mainImage: File | null;
  additionalImages: File[];
  price: string;
  exchange: boolean;
  features: Record<string, string>;
  material: string;
  condition: string;
  leafIndex?: number;
  treeAddress?: string;
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
    address: '',
    name: '',
    symbol: '',
    description: '',
    mainImage: null,
    additionalImages: [],
    price: '',
    exchange: false,
    features: {},
    material: '',
    condition: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof NFTFormData, string>>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const featuresRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof NFTFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
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
        additionalImages: [...prev.additionalImages, ...newImages],
      }));
    }
  };

  const removeAdditionalImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index),
    }));
  };

  const addFeature = () => {
    if (featuresRef.current?.value) {
      const [key, value] = featuresRef.current.value.split(':');
      if (key && value) {
        setFormData((prev) => ({
          ...prev,
          features: { ...prev.features, [key.trim()]: value.trim() },
        }));
        featuresRef.current.value = '';
      }
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof NFTFormData, string>> = {};

    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.symbol) newErrors.symbol = 'Symbol is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.mainImage) newErrors.mainImage = 'Main image is required';
    if (!formData.price) newErrors.price = 'Price is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission
      setSubmitStatus('success');
      // Reset after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  return (
    <Fade in timeout={800}>
      <form onSubmit={handleSubmit}>
        <Card sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
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
              {errors.mainImage && (
                <Typography color="error" variant="caption">
                  {errors.mainImage}
                </Typography>
              )}
            </Grid>

            {/* Additional Images */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Additional Images
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {formData.additionalImages.map((image, index) => (
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
              <TextField
                fullWidth
                label="NFT Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                error={!!errors.address}
                helperText={errors.address}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
                required
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
                required
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
                required
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
                required
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
                value={formData.material}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Condition"
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
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
                />
              </Stack>
              <Box sx={{ mt: 2 }}>
                {Object.entries(formData.features).map(([key, value]) => (
                  <Chip
                    key={key}
                    label={`${key}: ${value}`}
                    onDelete={() => {
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      const { [key]: _, ...rest } = formData.features;
                      setFormData((prev) => ({ ...prev, features: rest }));
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

            {/* Status Messages */}
            {submitStatus !== 'idle' && (
              <Grid item xs={12}>
                <Fade in>
                  <Alert
                    severity={submitStatus === 'success' ? 'success' : 'error'}
                    sx={{ mt: 2 }}
                  >
                    {submitStatus === 'success'
                      ? 'NFT created successfully!'
                      : 'Error creating NFT. Please try again.'}
                  </Alert>
                </Fade>
              </Grid>
            )}
          </Grid>
        </Card>
      </form>
    </Fade>
  );
};

export default NFTCreationForm;