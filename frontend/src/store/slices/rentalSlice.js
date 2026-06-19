// frontend/src/store/slices/rentalSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMyRentals = createAsyncThunk(
    'rental/fetchMy',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/rentals/my');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Xatolik yuz berdi');
        }
    }
);

export const createRental = createAsyncThunk(
    'rental/create',
    async (rentalData, { rejectWithValue }) => {
        try {
            const response = await api.post('/rentals', rentalData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Xatolik yuz berdi');
        }
    }
);

export const cancelRental = createAsyncThunk(
    'rental/cancel',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/rentals/${id}/cancel`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Xatolik yuz berdi');
        }
    }
);

const rentalSlice = createSlice({
    name: 'rental',
    initialState: {
        rentals: [],
        currentRental: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyRentals.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMyRentals.fulfilled, (state, action) => {
                state.loading = false;
                state.rentals = action.payload;
            })
            .addCase(fetchMyRentals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createRental.fulfilled, (state, action) => {
                state.rentals.unshift(action.payload);
            })
            .addCase(cancelRental.fulfilled, (state, action) => {
                const index = state.rentals.findIndex(r => r._id === action.payload._id);
                if (index !== -1) {
                    state.rentals[index] = action.payload;
                }
            });
    },
});

export const { clearError } = rentalSlice.actions;
export default rentalSlice.reducer;