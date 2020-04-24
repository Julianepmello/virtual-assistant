export class IntentUpload {
    domain_id: string;
    project_id: string;
    intent_display: string;
    intent_name: string;
    intent_description: string;
    text_entities: [{ text: string, entities: [] }];
}