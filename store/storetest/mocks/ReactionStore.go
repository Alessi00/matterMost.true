// Code generated by mockery v1.0.0. DO NOT EDIT.

// Regenerate this file using `make store-mocks`.

package mocks

import (
	model "github.com/mattermost/mattermost-server/v5/model"
	mock "github.com/stretchr/testify/mock"
)

// ReactionStore is an autogenerated mock type for the ReactionStore type
type ReactionStore struct {
	mock.Mock
}

// BulkGetForPosts provides a mock function with given fields: postIds
func (_m *ReactionStore) BulkGetForPosts(postIds []string) ([]*model.Reaction, error) {
	ret := _m.Called(postIds)

	var r0 []*model.Reaction
	if rf, ok := ret.Get(0).(func([]string) []*model.Reaction); ok {
		r0 = rf(postIds)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).([]*model.Reaction)
		}
	}

	var r1 error
	if rf, ok := ret.Get(1).(func([]string) error); ok {
		r1 = rf(postIds)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// Delete provides a mock function with given fields: reaction
func (_m *ReactionStore) Delete(reaction *model.Reaction) (*model.Reaction, error) {
	ret := _m.Called(reaction)

	var r0 *model.Reaction
	if rf, ok := ret.Get(0).(func(*model.Reaction) *model.Reaction); ok {
		r0 = rf(reaction)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*model.Reaction)
		}
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(*model.Reaction) error); ok {
		r1 = rf(reaction)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// DeleteAllWithEmojiName provides a mock function with given fields: emojiName
func (_m *ReactionStore) DeleteAllWithEmojiName(emojiName string) error {
	ret := _m.Called(emojiName)

	var r0 error
	if rf, ok := ret.Get(0).(func(string) error); ok {
		r0 = rf(emojiName)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// GetForPost provides a mock function with given fields: postID, allowFromCache
func (_m *ReactionStore) GetForPost(postID string, allowFromCache bool) ([]*model.Reaction, error) {
	ret := _m.Called(postID, allowFromCache)

	var r0 []*model.Reaction
	if rf, ok := ret.Get(0).(func(string, bool) []*model.Reaction); ok {
		r0 = rf(postID, allowFromCache)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).([]*model.Reaction)
		}
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(string, bool) error); ok {
		r1 = rf(postID, allowFromCache)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// Save provides a mock function with given fields: reaction
func (_m *ReactionStore) Save(reaction *model.Reaction) (*model.Reaction, error) {
	ret := _m.Called(reaction)

	var r0 *model.Reaction
	if rf, ok := ret.Get(0).(func(*model.Reaction) *model.Reaction); ok {
		r0 = rf(reaction)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*model.Reaction)
		}
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(*model.Reaction) error); ok {
		r1 = rf(reaction)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}
