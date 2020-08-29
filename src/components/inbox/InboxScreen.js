import * as React from 'react';
import {View} from 'react-native';
import baseStyles from '../../styles/baseStyles';

import {useContext} from 'react';
import {FlatList, Text, RefreshControl} from 'react-native';
import {TaskContext} from './TaskContext.js';
import {ListItem} from 'react-native-elements';

const InboxScreen = ({navigation}) => {
  const {tasks} = useContext(TaskContext);
  const [refreshing, setRefreshing] = React.useState(false);
  const itemKeyExtractor = (item) => item.entry.id;

  const renderItems = ({item}) => {
    var dueAt = new Date(item.entry.dueAt);
    var monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var dueAtDisplayed = 'Due Date Not Specified';
    var taskDescriptionDisplayed = '';

    if (isValidDate(dueAt)) {
      dueAtDisplayed = `Due by: ${daysOfWeek[dueAt.getDay()]} ${
        monthNames[dueAt.getMonth()]
      } ${dueAt.getDate()}, ${dueAt.getFullYear()}`;
    }

    if (item.entry.description) {
      taskDescriptionDisplayed = item.entry.description;
    }

    console.log('Due Date:');
    console.log(dueAt);
    console.log(item.entry.description);
    return (
      <ListItem
        title={taskDescriptionDisplayed}
        subtitle={dueAtDisplayed}
        onPress={() => navigation.navigate('TaskDetails', item)}
        bottomDivider
        chevron
        roundAvatar
        leftAvatar={{
          source: {
            uri: 'https://eisenvault.com/wp-content/uploads/2020/06/review.png',
          },
        }}
      />
    );
  };
  function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
  }
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => setRefreshing(false));
  }, []);
  return tasks.length ? (
    <View>
      <FlatList
        data={tasks}
        renderItem={renderItems}
        keyExtractor={itemKeyExtractor}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  ) : (
    <Text style={baseStyles.errorText}>No Pending Tasks</Text>
  );
};

export default InboxScreen;
