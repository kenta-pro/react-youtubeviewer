import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import VideosListTemplate from "~/components/templates/VideosListTemplate";
import Header from "~/components/organisms/Header";
import SearchForm from "~/components/organisms/SearchForm";
import VideosList from "~/components/organisms/VideosList";
import axios from "axios";

export const TopPagePresenter = ({
  search,
  searchNext,
  defaultKeyword,
  videos,
  loading,
}) => (
  <VideosListTemplate
    headerContents={<Header />}
    searchFormContents={
      <SearchForm onSubmit={search} defaultValue={defaultKeyword} />
    }
    videosListContents={<VideosList videos={videos} loading={loading} />}
    onScrollEnd={searchNext}
  />
);

TopPagePresenter.propTypes = {
  search: PropTypes.func.isRequired,
  searchNext: PropTypes.func.isRequired,
  defaultKeyword: PropTypes.string,
  videos: VideosList.propTypes.videos,
  loading: PropTypes.bool,
};

TopPagePresenter.defaultProps = {
  videos: null,
  loading: false,
  defaultKeyword: "",
};

const TopPageContainer = ({ api, presenter, defaultKeyword }) => {
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [loading, setLoading] = useState(false);
  const cleanedUp = useRef(false);

  /**
   * ビデオの取得
   * @param pageToken 続きを取得する場合は前回取得時のレスポンスに含まれるnextPageTokenを指定する
   * @returns {Promise<void>}
   */
  const getVideos = async (pageToken) => {
    setLoading(true);
    const {
      data: { items, nextPageToken: newNextPageToken },
    } = await api.search(keyword, { pageToken });
    if (cleanedUp.current) {
      return;
    }
    let nextVideos;
    if (pageToken) {
      const itemsWithoutDuplicated = items.filter(
        ({ id: itemId }) => !videos.find(({ id }) => id === itemId)
      );
      nextVideos = videos.concat(itemsWithoutDuplicated);
    } else {
      nextVideos = items;
    }
    setVideos(nextVideos);
    setNextPageToken(newNextPageToken);
    setLoading(false);
  };

  useEffect(() => {
    setNextPageToken(undefined);
    setVideos([]);
    getVideos();
  }, [keyword]);

  useEffect(
    () => () => {
      cleanedUp.current = true;
    },
    []
  );

  return presenter({
    search: setKeyword,
    searchNext: () => {
      if (loading || !nextPageToken) {
        return;
      }
      getVideos(nextPageToken);
    },
    defaultKeyword,
    videos,
    loading,
  });
};

TopPageContainer.propTypes = {
  api: PropTypes.shape({
    search: PropTypes.func,
  }),
  defaultKeyword: PropTypes.string,
  presenter: PropTypes.func.isRequired,
};

TopPageContainer.defaultProps = {
  api: {
    search: (keyword, params) =>
      axios.get(`/api/videos/search/${keyword}`, { params }),
  },
  defaultKeyword: "ねこ",
};

export default (props) => (
  <TopPageContainer presenter={TopPagePresenter} {...props} />
);
