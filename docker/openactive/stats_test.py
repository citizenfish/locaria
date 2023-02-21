stats =  {'pre_load': {'SessionSeries': 132540, 'FacilityUse': 10516, 'IndividualFacilityUse': 3889, 'Event': 250015, 'CourseInstance': 23508, 'ScheduledSession': 27707, 'Session': 20, 'OnDemandEvent': 342, 'League': 48, 'Course': 0}, 'post_load': {'SessionSeries': 139106, 'FacilityUse': 16403, 'IndividualFacilityUse': 3889, 'Event': 250030, 'CourseInstance': 23508, 'ScheduledSession': 40071, 'Session': 20, 'OnDemandEvent': 342, 'League': 48, 'Course': 0}, 'post_delete': {'SessionSeries': 6562, 'FacilityUse': 5877, 'IndividualFacilityUse': 0, 'Event': 0, 'CourseInstance': 0, 'ScheduledSession': 351, 'Session': 0, 'OnDemandEvent': 0, 'League': 0, 'Course': 0}}

p_res = [({'Event': 1, 'Course': 0, 'League': 0, 'Session': 0, 'FacilityUse': 15, 'delete_count': 5598, 'OnDemandEvent': 0, 'SessionSeries': 187, 'CourseInstance': 0, 'ScheduledSession': 5395, 'update_categories': {'message': 'view refreshed', 'refresh': {'refresh_view': 'completed'}, 'Activities': 1, 'Do it at home': 1, 'Mental Health': 1, 'Healthy Eating': 1}, 'IndividualFacilityUse': 0},)]

# Calculate the loaded values
loaded = {key: stats['post_load'][key] - value for key, value in stats['pre_load'].items()}
print("Loaded values:")
[print(f"{key}: {value}") for key, value in loaded.items()]

# Calculate the final values
final = {key: value + (stats['post_load'][key] - value) - stats['post_delete'][key] for key, value in stats['pre_load'].items()}

for key, value in p_res[0][0].items():
    if key in final:
        final[key] -= value

print("\nFinal values:")
[print(f"{key}: {value}") for key, value in final.items()]


