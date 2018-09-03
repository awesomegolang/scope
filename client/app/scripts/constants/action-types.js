import { zipObject } from 'lodash';

const ACTION_TYPES = [
  'ADD_QUERY_FILTER',
  'CACHE_ZOOM_STATE',
  'CHANGE_INSTANCE',
  'CHANGE_TOPOLOGY_OPTION',
  'CLEAR_CONTROL_ERROR',
  'CLICK_BACKGROUND',
  'CLICK_CLOSE_DETAILS',
  'CLICK_FORCE_RELAYOUT',
  'CLICK_NODE',
  'CLICK_RELATIVE',
  'CLICK_SHOW_TOPOLOGY_FOR_NODE',
  'CLICK_TERMINAL',
  'CLICK_TOPOLOGY',
  'CLOSE_TERMINAL',
  'CLOSE_WEBSOCKET',
  'DEBUG_TOOLBAR_INTERFERING',
  'DESELECT_NODE',
  'DO_CONTROL_ERROR',
  'DO_CONTROL_SUCCESS',
  'DO_CONTROL',
  'ENTER_EDGE',
  'ENTER_NODE',
  'FINISH_TIME_TRAVEL_TRANSITION',
  'HIDE_HELP',
  'HOVER_METRIC',
  'JUMP_TO_TIME',
  'LEAVE_EDGE',
  'LEAVE_NODE',
  'MONITOR_STATE',
  'OPEN_WEBSOCKET',
  'PAUSE_TIME_AT_NOW',
  'PIN_METRIC',
  'PIN_NETWORK',
  'RECEIVE_API_DETAILS',
  'RECEIVE_CONTROL_NODE_REMOVED',
  'RECEIVE_CONTROL_PIPE_STATUS',
  'RECEIVE_CONTROL_PIPE',
  'RECEIVE_ERROR',
  'RECEIVE_NODE_DETAILS',
  'RECEIVE_NODES_DELTA',
  'RECEIVE_NODES_FOR_TOPOLOGY',
  'RECEIVE_NODES',
  'RECEIVE_NOT_FOUND',
  'RECEIVE_TOPOLOGIES',
  'RESET_LOCAL_VIEW_STATE',
  'RESUME_TIME',
  'ROUTE_TOPOLOGY',
  'SELECT_NETWORK',
  'SET_EXPORTING_GRAPH',
  'SET_RECEIVED_NODES_DELTA',
  'SET_STORE_VIEW_STATE',
  'SET_VIEW_MODE',
  'SET_VIEWPORT_DIMENSIONS',
  'SHOW_HELP',
  'SHOW_NETWORKS',
  'SHUTDOWN',
  'SORT_ORDER_CHANGED',
  'TOGGLE_CONTRAST_MODE',
  'TOGGLE_TROUBLESHOOTING_MENU',
  'UNHOVER_METRIC',
  'UNPIN_METRIC',
  'UNPIN_NETWORK',
  'UPDATE_SEARCH',
];

export default zipObject(ACTION_TYPES, ACTION_TYPES);
