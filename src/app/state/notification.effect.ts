import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ToastrService } from "ngx-toastr";
import { tap } from "rxjs";
import { PRODUCT_ACTIONS_TYPES } from "../shared/constants/actions-type.constants";
import { formatMessage } from "../shared/helpers/format-message.helper";
import { SUCCESS_MESSAGES } from "../shared/constants/message.constants";

@Injectable()
export class NotificationEffect{
    private actions$ = inject(Actions);
    private toastr = inject(ToastrService);

    showToastr$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
            PRODUCT_ACTIONS_TYPES.ADD_SUCCESS,
            PRODUCT_ACTIONS_TYPES.ADD_FAILURE,
            PRODUCT_ACTIONS_TYPES.UPDATE_SUCCESS,
            PRODUCT_ACTIONS_TYPES.UPDATE_FAILURE,
            PRODUCT_ACTIONS_TYPES.DELETE_SUCCESS,
            PRODUCT_ACTIONS_TYPES.DELETE_FAILURE,
        ),
        tap(action => {
          const isSuccess = action.type.includes('Success');
          const entity = action.type.split(' ')[0].replace('[', '').replace(']', '');
          let message: string = '';

          switch (action.type) {
            case PRODUCT_ACTIONS_TYPES.ADD_SUCCESS: {
              message = SUCCESS_MESSAGES.ADD;
              break;
            }
            case PRODUCT_ACTIONS_TYPES.UPDATE_SUCCESS: {
              message = SUCCESS_MESSAGES.UPDATE;  
              break;
            }
            case PRODUCT_ACTIONS_TYPES.DELETE_SUCCESS: {
              message = SUCCESS_MESSAGES.DELETE;  
              break;
            }
            case PRODUCT_ACTIONS_TYPES.DELETE_FAILURE: {
              message = formatMessage(SUCCESS_MESSAGES.NOT_FOUND_TO_DELETE, entity);
              break;
            }
            case PRODUCT_ACTIONS_TYPES.UPDATE_FAILURE: {
              message = formatMessage(SUCCESS_MESSAGES.NOT_FOUND_TO_SAVE, entity);
              break;
            }
            case PRODUCT_ACTIONS_TYPES.ADD_FAILURE: {
              message = formatMessage(SUCCESS_MESSAGES.NOT_FOUND_TO_DELETE, entity);
              break;
            }
          }

          if (isSuccess) {
            this.toastr.success(message);
          } else {
            this.toastr.error(message);
          }
        })
      ),
    { dispatch: false }
  );
}