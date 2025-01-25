import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export const profileApi = createApi({
  reducerPath: "profileApi",
  // baseQuery: fetchBaseQuery({ baseUrl: "https://77eewm.qdhgtch.com/api/v1" }),
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).persist?.user?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getMyProfile: builder.query<any, string>({
      query: () => ({
        url: `/profile/me`,
        method: "GET",
      }),
    }),
    getUserProfile: builder.query<any, string>({
      query: (id) => ({
        url: `/profile/get-profile?user_id=${id}`,
        method: "GET",
      }),
    }),
    getRegion: builder.query<any, string>({
      // query: () => `/pcities-and-provinces`,
      query: () => ({
        url: `/cities-and-provinces`,
        method: "GET",
      }),
    }),
    changeUsername: builder.mutation({
      query: ({ username }) => ({
        url: `/profile/change-username`,
        method: "POST",
        body: {
          username,
        },
      }),
    }),
    changeNickname: builder.mutation({
      query: ({ nickname }) => ({
        url: `/profile/change-nickname`,
        method: "POST",
        body: {
          nickname,
        },
      }),
    }),
    changeGender: builder.mutation({
      query: ({ gender }) => ({
        url: `/profile/change-gender`,
        method: "POST",
        body: {
          gender,
        },
      }),
    }),
    changeBio: builder.mutation({
      query: ({ bio }) => ({
        url: `/profile/save-bio`,
        method: "POST",
        body: {
          bio,
        },
      }),
    }),
    changeReferralCode: builder.mutation({
      query: ({ referral_code }) => ({
        url: `/profile/save-referral-code`,
        method: "POST",
        body: {
          referral_code,
        },
      }),
    }),
    uploadProfilePic: builder.mutation({
      query: ({ file_url }) => ({
        url: `/profile/upload`,
        method: "POST",
        body: {
          file_url,
        },
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `/profile/logout`,
        method: "POST",
      }),
    }),
    changePassword: builder.mutation({
      query: ({ current_password, new_password }) => ({
        url: `/profile/change-password`,
        method: "POST",
        body: {
          current_password,
          new_password,
        },
      }),
    }),
    changePrivateProfileStats: builder.mutation({
      query: ({ status }) => ({
        url: `/profile/private-profile-status`,
        method: "POST",
        body: {
          status,
        },
      }),
    }),
    changeVisibility: builder.mutation({
      query: ({ status }) => ({
        url: `/profile/liked-video-visibility`,
        method: "POST",
        body: {
          status,
        },
      }),
    }),
    changeCVis: builder.mutation({
      query: ({ status }) => ({
        url: `/profile/content-visibility`,
        method: "POST",
        body: {
          status,
        },
      }),
    }),
    changeRegion: builder.mutation({
      query: (region) => ({
        url: `/profile/change-region`,
        method: "POST",
        body: region,
      }),
    }),
    getLikedPost: builder.query<any, any>({
      query: ({ user_id, page }) => ({
        url: `/user/liked-post?user_id=${user_id}&page=${page}`,
        method: "GET",
      }),
    }),
    getSecurityQuestions: builder.mutation<any, string>({
      query: () => ({
        url: `/get-security-question`,
        method: "Post",
      }),
    }),
    removeSecurityQuestion: builder.mutation<any, string>({
      query: () => ({
        url: `/profile/remove-security-question`,
        method: "Post",
      }),
    }),
    getFollowerList: builder.query<any, string>({
      query: (user_id) => ({
        url: `/follower/follower-list?user_id=${user_id}`,
        method: "GET",
      }),
    }),
    getFollowingList: builder.query<any, string>({
      query: (user_id) => ({
        url: `/follower/following-list?user_id=${user_id}`,
        method: "GET",
      }),
    }),
    changeFollowStatus: builder.mutation<any, string>({
      query: ({ follow_user_id, status }: any) => ({
        url: `/follower/change-follow-status`,
        method: "Post",
        body: { follow_user_id, status },
      }),
    }),
    getNoti: builder.query<any, string>({
      query: () => ({
        url: `/notification/list?type=general&pageSize=3&page=1`,
        method: "GET",
      }),
    }),
    settingUpload: builder.mutation<any, any>({
      query: ({ filedata, filePath }: any) => ({
        url: `/storage/upload`,
        method: "Post",
        body: { filePath, file: filedata },
      }),
    }),
    profileUpload: builder.mutation<any, any>({
      query: ({ file_url }: any) => ({
        url: `/profile/upload`,
        method: "Post",
        body: { file_url },
      }),
    }),
    changeCover: builder.mutation<any, any>({
      query: ({ file_url }: any) => ({
        url: `/profile/change-cover-photo`,
        method: "Post",
        body: { file_url },
      }),
    }),
    removeCover: builder.mutation<any, any>({
      query: () => ({
        url: `/profile/remove-cover-photo`,
        method: "Post",
      }),
    }),
    getlikePostList: builder.query<any, any>({
      query: ({ id, page }) => ({
        url: `/user/liked-post?user_id=${id}&page=${page}`,
        method: "Get",
      }),
    }),
    checkUsername: builder.mutation<any, any>({
      query: ({ username, captcha, captcha_key }) => ({
        url: `/check-username`,
        method: "Post",
        body: {
          username,
          captcha,
          captcha_key,
        },
      }),
    }),
    checkAnswer: builder.mutation<any, any>({
      query: ({ token, answer }) => ({
        url: `/check-security-answer`,
        method: "Post",
        body: {
          token,
          answer,
        },
      }),
    }),
    setPassword: builder.mutation<any, any>({
      query: ({ token, password }) => ({
        url: `/set-password`,
        method: "Post",
        body: {
          token,
          password,
        },
      }),
    }),
    changeFollowReq: builder.mutation<any, any>({
      query: (status) => ({
        url: `/profile/disallow-follow-request`,
        method: "Post",
        body: {
          status,
        },
      }),
    }),
    changeHideBio: builder.mutation<any, any>({
      query: (status) => ({
        url: `/profile/hide-bio`,
        method: "Post",
        body: {
          status,
        },
      }),
    }),
    changeShareRegion: builder.mutation<any, any>({
      query: (status) => ({
        url: `/profile/share-region`,
        method: "Post",
        body: {
          status,
        },
      }),
    }),
    getConfig: builder.query<any, any>({
      query: (os) => ({
        url: `/app/version?platform=${os}`,
        method: "GET",
      }),
    }),
    getWatchHistory: builder.query<any, any>({
      query: ({ page }) => ({
        url: `/watch-history?pageSize=10&page=${page}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetConfigQuery,
  useChangeShareRegionMutation,
  useChangeHideBioMutation,
  useChangeFollowReqMutation,
  useChangeCVisMutation,
  useSetPasswordMutation,
  useCheckAnswerMutation,
  useCheckUsernameMutation,
  useGetlikePostListQuery,
  useGetMyProfileQuery,
  useChangeUsernameMutation,
  useChangeGenderMutation,
  useChangeBioMutation,
  useChangeReferralCodeMutation,
  useUploadProfilePicMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useChangePrivateProfileStatsMutation,
  useChangeVisibilityMutation,
  useGetRegionQuery,
  useChangeRegionMutation,
  useChangeNicknameMutation,
  useGetLikedPostQuery,
  useGetSecurityQuestionsMutation,
  useGetFollowerListQuery,
  useGetFollowingListQuery,
  useChangeFollowStatusMutation,
  useGetUserProfileQuery,
  useGetNotiQuery,
  useRemoveSecurityQuestionMutation,
  useSettingUploadMutation,
  useProfileUploadMutation,
  useChangeCoverMutation,
  useRemoveCoverMutation,
  useGetWatchHistoryQuery,
} = profileApi;
