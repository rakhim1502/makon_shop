// frontend/src/store/slices/equipmentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchEquipment = createAsyncThunk(
    'equipment/fetchAll',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/equipment', { params: filters });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Xatolik yuz berdi');
        }
    }
);

export const fetchEquipmentById = createAsyncThunk(
    'equipment/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/equipment/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Xatolik yuz berdi');
        }
    }
);

const equipmentSlice = createSlice({
    name: 'equipment',
    initialState: {
        items: [],
        currentEquipment: null,
        loading: false,
        error: null,
        pagination: {
            page: 1,
            limit: 12,
            total: 0,
            pages: 0,
        },
    },
    reducers: {
        clearCurrentEquipment: (state) => {
            state.currentEquipment = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEquipment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEquipment.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchEquipment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchEquipmentById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchEquipmentById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentEquipment = action.payload;
            })
            .addCase(fetchEquipmentById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentEquipment, clearError } = equipmentSlice.actions;
export default equipmentSlice.reducer;