import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import request from "../../api";

const initialState = {
    skills: [],
    selected: null,
    isModalOpen: false,
    error: null,
    total: 0,
    loading: false,
    btnLoading: false,
};

export const getSkills = createAsyncThunk(
    "skill/getSkills",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await request.get("skills");
            return data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const getSkill = createAsyncThunk(
    "skill/getSkill",
    async (action, { rejectWithValue }) => {
        try {
            const { data } = await request.get(`skills/${action}`);
            return data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const addSkill = createAsyncThunk(
    "skill/addSkill",
    async (action, { rejectWithValue }) => {
        try {
            await request.post("skills", action);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const updateSkill = createAsyncThunk(
    "skill/putSkill",
    async (action, { rejectWithValue }) => {
        try {
            await request.put(`skills/${action.id}`, action.values);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const deleteSkill = createAsyncThunk(
    "skill/deleteSkill",
    async (action, { rejectWithValue }) => {
        try {
            await request.delete(`skills/${action}`);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

const skillSlice = createSlice({
    name: "skill",
    initialState,
    reducers: {
        showModal(state, { payload }) {
            state.isModalOpen = true;
            state.selected = null;
            payload.resetFields();
        },
        manageModal(state) {
            state.isModalOpen = !state.isModalOpen;
        },
        editSkill(state, { payload }) {
            state.isModalOpen = true;
            state.selected = payload;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(getSkills.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSkills.fulfilled, (state, { payload }) => {
                state.skills = payload.data;
                state.total = payload.pagination.total;
                state.loading = false;
            })
            .addCase(getSkills.rejected, (state, { payload }) => {
                state.error = payload;
                state.loading = false;
            })
            .addCase(addSkill.pending, (state) => {
                state.btnLoading = true;
            })
            .addCase(addSkill.fulfilled, (state) => {
                state.btnLoading = false;
            })
            .addCase(addSkill.rejected, (state) => {
                state.btnLoading = false;
            })
            .addCase(deleteSkill.pending, (state) => {
                state.btnLoading = true;
            })
            .addCase(deleteSkill.fulfilled, (state) => {
                state.btnLoading = false;
            })
            .addCase(deleteSkill.rejected, (state) => {
                state.btnLoading = false;
            });
    },
});
export const { manageModal, showModal, editSkill } = skillSlice.actions;

export default skillSlice.reducer;